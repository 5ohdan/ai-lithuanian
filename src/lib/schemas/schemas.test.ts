import { describe, expect, it } from "vitest";
import { briefPack, fullPack, storedBriefPack, storedFullPack } from "../../../tests/fixtures";
import { packInputSchema } from "./inputs";
import { storageSchema, storedPackSchema } from "./storage";
import { briefPackSchema, MAX_PACK_WORDS, packSchema } from "./wordsets";

const validInput = { topic: "greetings", difficulty: "Beginner", count: 5 };

describe("generation input", () => {
  it.each(["Beginner", "Intermediate", "Advanced"])("accepts %s difficulty", (difficulty) => {
    expect(packInputSchema.safeParse({ ...validInput, difficulty }).success).toBe(true);
  });

  it.each([
    { topic: "ab" },
    { topic: "a".repeat(201) },
    { difficulty: "Expert" },
    { count: 4 },
    { count: 16 },
    { count: "5" },
  ])("rejects invalid input %j", (overrides) => {
    expect(packInputSchema.safeParse({ ...validInput, ...overrides }).success).toBe(false);
  });

  it.each([
    { topic: "abc", count: 5 },
    { topic: "a".repeat(200), count: 15 },
  ])("accepts input at the bounds %j", (overrides) => {
    expect(packInputSchema.safeParse({ ...validInput, ...overrides }).success).toBe(true);
  });
});

describe("generated pack schemas", () => {
  it("defaults a brief pack to not enriched", () => {
    expect(briefPackSchema.parse({ title: briefPack.title, words: briefPack.words }).enriched).toBe(
      false,
    );
  });

  it.each([0, MAX_PACK_WORDS + 1])("rejects a brief pack with %i words", (count) => {
    expect(
      briefPackSchema.safeParse({
        ...briefPack,
        words: Array.from({ length: count }, () => briefPack.words[0]),
      }).success,
    ).toBe(false);
  });

  it("accepts the maximum number of brief words", () => {
    expect(
      briefPackSchema.safeParse({
        ...briefPack,
        words: Array.from({ length: MAX_PACK_WORDS }, () => briefPack.words[0]),
      }).success,
    ).toBe(true);
  });

  it("rejects missing word fields rather than accepting partial AI output", () => {
    expect(
      briefPackSchema.safeParse({ ...briefPack, words: [{ original: "Labas" }] }).success,
    ).toBe(false);
    expect(packSchema.safeParse(briefPack).success).toBe(false);
  });

  it("accepts a fully enriched pack", () => {
    expect(packSchema.parse(fullPack)).toEqual(fullPack);
  });

  it.each([
    { partOfSpeech: "invalid" },
    { gender: "invalid" },
    { meanings: [] },
    { meanings: [{ context: "greeting" }] },
  ])("rejects invalid enrichment %j", (overrides) => {
    expect(
      packSchema.safeParse({ ...fullPack, words: [{ ...fullPack.words[0], ...overrides }] })
        .success,
    ).toBe(false);
  });
});

describe("persisted pack schemas", () => {
  it.each([storedBriefPack, storedFullPack])("accepts $status packs", (pack) => {
    expect(storedPackSchema.parse(pack)).toEqual(pack);
  });

  it.each([
    { id: "not-a-uuid" },
    { createdAt: "yesterday" },
    { status: "unknown" },
    { status: "full" },
    { difficulty: "Expert" },
  ])("rejects invalid persisted metadata or incomplete full data %j", (overrides) => {
    expect(storedPackSchema.safeParse({ ...storedBriefPack, ...overrides }).success).toBe(false);
  });

  it("normalizes legacy packs without losing either collection", () => {
    expect(
      storageSchema.parse({ packs: [storedFullPack], briefPacks: [storedBriefPack], words: [] }),
    ).toEqual({ packs: [storedFullPack, storedBriefPack] });
  });

  it("accepts an empty current storage payload", () => {
    expect(storageSchema.parse({ packs: [] })).toEqual({ packs: [] });
  });
});
