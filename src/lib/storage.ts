import type {
  StoredPack,
  Storage,
  Pack,
  Difficulty,
  BriefPack,
  StoredBriefPack,
} from "./schemas";

import { storageSchema } from "./schemas";

const STORAGE_KEY = "wordLearningStorage";

interface StorageManagerInterface {
  subscribe(callback: () => void): () => void;
  addPack(pack: Pack, difficulty: Difficulty, topic: string): string;
  addBriefPack(
    briefPack: BriefPack,
    difficulty: Difficulty,
    topic: string,
  ): string;
  getPacks(): StoredPack[];
  getPackById(packId: string): StoredPack | undefined;
  getBriefPacks(): StoredBriefPack[];
  getBriefPackById(packId: string): StoredBriefPack | undefined;
  removePack(id: string): void;
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
      return { words: [], packs: [], briefPacks: [] };
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = storageSchema.parse(JSON.parse(data));
        return parsed;
      }
    } catch (error) {
      console.error("Error loading storage:", error);
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

  addBriefPack(
    briefPack: BriefPack,
    difficulty: Difficulty,
    topic: string,
  ): string {
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

  removePack(id: string): void {
    const index = this.storage.packs.findIndex((s) => s.id === id);
    if (index !== -1) {
      this.storage.packs.splice(index, 1);
      this.saveStorage();
    }
  }

  deleteAllPacks(): void {
    this.storage.packs = [];
    this.storage.briefPacks = [];
    this.saveStorage();
  }

  // Convert a brief pack to a full pack with the same ID
  convertBriefToFullPack(briefpackId: string, pack: Pack): string {
    // Find and remove the brief pack
    const briefIndex = this.storage.briefPacks.findIndex(
      (s) => s.id === briefpackId,
    );

    if (briefIndex === -1) {
      console.error(`Brief pack with ID ${briefpackId} not found`);
      return this.addPack(pack, "Beginner", "Unknown"); // Fallback
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

    return briefPack.id;
  }
}

let storageInstance: StorageManager | null = null;

export function getStorage(): StorageManager {
  if (typeof window !== "undefined" && !storageInstance) {
    storageInstance = new StorageManager();
  }
  return storageInstance ?? new StorageManager();
}
