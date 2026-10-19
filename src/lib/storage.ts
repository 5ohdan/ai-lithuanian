import type { StoredPack, Storage, Pack, Difficulty, BriefPack, StoredBriefPack } from "./schemas";

import { storageSchema } from "./schemas";

const STORAGE_KEY = "wordLearningStorage";
// Preserves the raw payload when the stored data no longer matches the schema,
// so a schema change (e.g. a renamed field) can never permanently destroy user data.
const BACKUP_KEY = "wordLearningStorage.backup";

interface StorageManagerInterface {
  subscribe(callback: () => void): () => void;
  addPack(pack: Pack, difficulty: Difficulty, topic: string): string;
  addBriefPack(briefPack: BriefPack, difficulty: Difficulty, topic: string): string;
  getPacks(): StoredPack[];
  getPackById(packId: string): StoredPack | undefined;
  getBriefPacks(): StoredBriefPack[];
  getBriefPackById(packId: string): StoredBriefPack | undefined;
  removePack(id: string): boolean;
  convertBriefToFullPack(briefpackId: string, pack: Pack): ConvertBriefResult;
}

/** Mirrors the operation's outcome instead of failing silently. */
export type ConvertBriefResult = { ok: true; id: string } | { ok: false };

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
      return { words: [], packs: [], briefPacks: [] };
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
    return { words: [], packs: [], briefPacks: [] };
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

  addPack(pack: Pack, difficulty: Difficulty, topic: string): string {
    const packId = crypto.randomUUID();
    const storedPack: StoredPack = {
      words: pack.words,
      id: packId,
      title: pack.title,
      difficulty,
      createdAt: new Date().toISOString(),
      usersTopic: topic,
    };
    this.storage.packs.push(storedPack);
    this.saveStorage();
    return packId;
  }

  addBriefPack(briefPack: BriefPack, difficulty: Difficulty, topic: string): string {
    const packId = crypto.randomUUID();
    const storedBriefPack: StoredBriefPack = {
      words: briefPack.words,
      id: packId,
      title: briefPack.title,
      usersTopic: topic,
      difficulty,
      createdAt: new Date().toISOString(),
    };
    this.storage.briefPacks.push(storedBriefPack);
    this.saveStorage();
    return packId;
  }

  getPacks(): StoredPack[] {
    return this.storage.packs;
  }

  getPackById(packId: string): StoredPack | undefined {
    return this.storage.packs.find((s) => s.id === packId);
  }

  getBriefPacks(): StoredBriefPack[] {
    return this.storage.briefPacks;
  }

  getBriefPackById(packId: string): StoredBriefPack | undefined {
    return this.storage.briefPacks.find((s) => s.id === packId);
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
    this.storage.briefPacks = [];
    this.saveStorage();
  }

  // Convert a brief pack to a full pack with the same ID.
  // Does NOT fall back to creating an unrelated pack when the brief is missing;
  // the caller decides how to react to `{ ok: false }`.
  convertBriefToFullPack(briefpackId: string, pack: Pack): ConvertBriefResult {
    // Find and remove the brief pack
    const briefIndex = this.storage.briefPacks.findIndex((s) => s.id === briefpackId);

    if (briefIndex === -1) {
      console.error(`Brief pack with ID ${briefpackId} not found`);
      return { ok: false };
    }

    const briefPack = this.storage.briefPacks[briefIndex]!; // Non-null assertion is safe here because we checked index !== -1
    this.storage.briefPacks.splice(briefIndex, 1);

    // Create full pack with the same ID
    const storedSet: StoredPack = {
      words: pack.words,
      id: briefPack.id,
      title: pack.title,
      difficulty: briefPack.difficulty,
      createdAt: briefPack.createdAt,
      usersTopic: briefPack.usersTopic,
    };

    this.storage.packs.push(storedSet);
    this.saveStorage();

    return { ok: true, id: briefPack.id };
  }
}

let storageInstance: StorageManager | null = null;

export function getStorage(): StorageManager {
  if (typeof window !== "undefined" && !storageInstance) {
    storageInstance = new StorageManager();
  }
  return storageInstance ?? new StorageManager();
}
