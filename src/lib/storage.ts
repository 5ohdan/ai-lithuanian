import type {
  Storage,
  StoredBriefPack,
  StoredFullPack,
  StoredPack,
  Pack,
  Difficulty,
  BriefPack,
} from "./schemas";

import { storageSchema } from "./schemas";

const STORAGE_KEY = "wordLearningStorage";
// Preserves the raw payload when the stored data no longer matches the schema,
// so a schema change (e.g. a renamed field) can never permanently destroy user data.
const BACKUP_KEY = "wordLearningStorage.backup";

export type EnrichPackResult = { ok: true; id: string } | { ok: false };

interface StorageManagerInterface {
  subscribe(callback: () => void): () => void;
  addBriefPack(briefPack: BriefPack, difficulty: Difficulty, topic: string): string;
  getPacks(): StoredPack[];
  getPackById(packId: string): StoredPack | undefined;
  /** Updates a brief pack in place with enriched words, marking it `full`. */
  enrichPack(packId: string, pack: Pack): EnrichPackResult;
  /** @returns `true` if the pack was found and removed, `false` otherwise. */
  removePack(id: string): boolean;
  deleteAllPacks(): void;
}

export class StorageManager implements StorageManagerInterface {
  private storage: Storage;
  private isClient: boolean;
  private subscribers: Set<() => void> = new Set<() => void>();

  constructor() {
    this.isClient = typeof window !== "undefined";
    this.storage = this.loadStorage();
  }

  private loadStorage(): Storage {
    if (!this.isClient) {
      return { packs: [] };
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = storageSchema.parse(JSON.parse(data));
        return parsed;
      }
    } catch (error) {
      console.error("Error loading storage — stored data kept as backup:", error);
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
          localStorage.setItem(BACKUP_KEY, data);
        }
      } catch (backupError) {
        console.error("Error backing up storage:", backupError);
      }
    }
    return { packs: [] };
  }

  private saveStorage(): void {
    if (!this.isClient) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.storage));
      this.notifySubscribers();
    } catch (error) {
      console.error("Error saving storage:", error);
    }
  }

  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback());
  }

  addBriefPack(briefPack: BriefPack, difficulty: Difficulty, topic: string): string {
    const packId = crypto.randomUUID();
    const storedPack: StoredBriefPack = {
      id: packId,
      status: "brief",
      words: briefPack.words,
      title: briefPack.title,
      difficulty,
      usersTopic: topic,
      createdAt: new Date().toISOString(),
    };
    this.storage.packs.push(storedPack);
    this.saveStorage();
    return packId;
  }

  getPacks(): StoredPack[] {
    return this.storage.packs;
  }

  getPackById(packId: string): StoredPack | undefined {
    return this.storage.packs.find((s) => s.id === packId);
  }

  /**
   * Updates a brief pack in place with the enriched words and title,
   * marking it `full`. Keeps the pack's id, difficulty and topic.
   * Returns `{ ok: false }` if the brief pack was not found — the caller
   * decides how to react; no fallback packs are fabricated.
   */
  enrichPack(packId: string, pack: Pack): EnrichPackResult {
    const index = this.storage.packs.findIndex((p) => p.id === packId && p.status === "brief");

    if (index === -1) {
      console.error(`Brief pack with ID ${packId} not found`);
      return { ok: false };
    }

    const briefPack = this.storage.packs[index] as StoredBriefPack;

    const enrichedPack: StoredFullPack = {
      id: briefPack.id,
      words: pack.words,
      status: "full",
      title: pack.title,
      difficulty: briefPack.difficulty,
      createdAt: briefPack.createdAt,
      usersTopic: briefPack.usersTopic,
    };

    this.storage.packs.splice(index, 1, enrichedPack);
    this.saveStorage();

    return { ok: true, id: briefPack.id };
  }

  /** @returns `true` if the pack was found and removed, `false` otherwise. */
  removePack(id: string): boolean {
    const index = this.storage.packs.findIndex((s) => s.id === id);
    if (index !== -1) {
      this.storage.packs.splice(index, 1);
      this.saveStorage();
      return true;
    }
    return false;
  }

  deleteAllPacks(): void {
    this.storage.packs = [];
    this.saveStorage();
  }
}

let storageInstance: StorageManager | null = null;

export function getStorage(): StorageManager {
  if (typeof window !== "undefined" && !storageInstance) {
    storageInstance = new StorageManager();
  }
  return storageInstance ?? new StorageManager();
}
