import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { briefPack, fullPack, storedBriefPack, storedFullPack } from "../../tests/fixtures";
import { getStorage, StorageManager } from "./storage";

const key = "wordLearningStorage";
const backupKey = "wordLearningStorage.backup";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: vi.fn((name: string) => values.get(name) ?? null),
    setItem: vi.fn((name: string, value: string) => {
      values.set(name, value);
    }),
  };
}

let local: ReturnType<typeof memoryStorage>;

beforeEach(() => {
  local = memoryStorage();
  vi.stubGlobal("window", {});
  vi.stubGlobal("localStorage", local);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("StorageManager", () => {
  it("starts empty when no data exists", () => {
    expect(new StorageManager().getPacks()).toEqual([]);
    expect(local.setItem).not.toHaveBeenCalled();
  });

  it("creates a brief pack and reloads its metadata and words", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T12:00:00.000Z"));
    const storage = new StorageManager();
    const id = storage.addBriefPack(briefPack, "Beginner", "greetings");
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(storage.getPackById(id)).toEqual({ ...storedBriefPack, id });
    expect(new StorageManager().getPackById(id)).toEqual(storage.getPackById(id));
  });

  it("enriches in place without losing identity, topic, difficulty or creation time", () => {
    const storage = new StorageManager();
    const id = storage.addBriefPack(briefPack, "Advanced", "custom topic");
    const original = storage.getPackById(id);
    expect(storage.enrichPack(id, fullPack)).toEqual({ ok: true, id });
    expect(storage.getPacks()).toHaveLength(1);
    expect(storage.getPackById(id)).toEqual({
      ...original,
      status: "full",
      title: fullPack.title,
      words: fullPack.words,
    });
    expect(new StorageManager().getPackById(id)).toEqual(storage.getPackById(id));
  });

  it("does not fabricate a pack when enrichment targets a missing ID", () => {
    const storage = new StorageManager();
    expect(storage.enrichPack("missing", fullPack)).toEqual({ ok: false });
    expect(storage.getPacks()).toEqual([]);
    expect(local.setItem).not.toHaveBeenCalled();
  });

  it("does not enrich a full pack a second time", () => {
    local.setItem(key, JSON.stringify({ packs: [storedFullPack] }));
    const storage = new StorageManager();
    local.setItem.mockClear();
    expect(storage.enrichPack(storedFullPack.id, fullPack)).toEqual({ ok: false });
    expect(storage.getPackById(storedFullPack.id)).toEqual(storedFullPack);
    expect(local.setItem).not.toHaveBeenCalled();
  });

  it("removes only the selected pack and persists the deletion", () => {
    local.setItem(key, JSON.stringify({ packs: [storedBriefPack, storedFullPack] }));
    const storage = new StorageManager();
    expect(storage.removePack(storedBriefPack.id)).toBe(true);
    expect(storage.getPackById(storedBriefPack.id)).toBeUndefined();
    expect(new StorageManager().getPacks()).toEqual([storedFullPack]);
  });

  it("returns false without saving when removing an unknown ID", () => {
    const storage = new StorageManager();
    expect(storage.removePack("missing")).toBe(false);
    expect(local.setItem).not.toHaveBeenCalled();
  });

  it("clears all packs without deleting unrelated local storage", () => {
    local.setItem(key, JSON.stringify({ packs: [storedBriefPack, storedFullPack] }));
    local.setItem("unrelated", "keep me");
    new StorageManager().deleteAllPacks();
    expect(new StorageManager().getPacks()).toEqual([]);
    expect(local.getItem("unrelated")).toBe("keep me");
  });

  it("notifies subscribers after a save and stops after unsubscribe", () => {
    const storage = new StorageManager();
    const subscriber = vi.fn(() => {
      expect(local.getItem(key)).toBe(JSON.stringify({ packs: storage.getPacks() }));
    });
    const unsubscribe = storage.subscribe(subscriber);
    storage.addBriefPack(briefPack, "Beginner", "greetings");
    expect(subscriber).toHaveBeenCalledTimes(1);
    unsubscribe();
    storage.deleteAllPacks();
    expect(subscriber).toHaveBeenCalledTimes(1);
  });

  it("loads the legacy split format and persists the consolidated format on save", () => {
    local.setItem(
      key,
      JSON.stringify({ words: [], packs: [storedFullPack], briefPacks: [storedBriefPack] }),
    );
    const storage = new StorageManager();
    expect(storage.getPacks()).toEqual([storedFullPack, storedBriefPack]);
    storage.removePack(storedBriefPack.id);
    expect(new StorageManager().getPacks()).toEqual([storedFullPack]);
    expect(local.getItem(key)).not.toContain('"briefPacks"');
  });

  it.each(["{invalid JSON", JSON.stringify({ packs: [{ id: "broken" }] })])(
    "backs up invalid stored data before allowing new saves (%s)",
    (raw) => {
      local.setItem(key, raw);
      const storage = new StorageManager();
      expect(storage.getPacks()).toEqual([]);
      expect(local.getItem(key)).toBe(raw);
      expect(local.getItem(backupKey)).toBe(raw);
      storage.addBriefPack(briefPack, "Beginner", "greetings");
      expect(local.getItem(backupKey)).toBe(raw);
    },
  );

  it("recovers when local storage cannot be read", () => {
    local.getItem.mockImplementation(() => {
      throw new Error("Access denied");
    });
    expect(new StorageManager().getPacks()).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });

  it("does not throw or notify a successful save when storage is full", () => {
    const storage = new StorageManager();
    const subscriber = vi.fn();
    storage.subscribe(subscriber);
    local.setItem.mockImplementation(() => {
      throw new Error("Quota exceeded");
    });
    expect(() => storage.addBriefPack(briefPack, "Beginner", "greetings")).not.toThrow();
    expect(subscriber).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it("is safe during server rendering and does not share storage between server calls", () => {
    vi.stubGlobal("window", undefined);
    const storage = new StorageManager();
    storage.addBriefPack(briefPack, "Beginner", "greetings");
    expect(local.getItem).not.toHaveBeenCalled();
    expect(local.setItem).not.toHaveBeenCalled();
    expect(getStorage()).not.toBe(getStorage());
    expect(getStorage().getPacks()).toEqual([]);
  });
});
