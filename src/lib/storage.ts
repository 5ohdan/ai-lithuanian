import type {
  StoredWord,
  StoredWordSet,
  Storage,
  WordSet,
  Word,
  Difficulty,
  BriefWordSet,
  StoredBriefWordSet,
} from "./schemas";

import { storageSchema } from "./schemas";

const STORAGE_KEY = "wordLearningStorage";

export class StorageManager {
  private storage: Storage;
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== "undefined";
    this.storage = this.loadStorage();
  }

  private loadStorage(): Storage {
    if (!this.isClient) {
      return { words: [], wordSets: [], briefWordSets: [] };
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
    return { words: [], wordSets: [], briefWordSets: [] };
  }

  private saveStorage(): void {
    if (!this.isClient) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.storage));
    } catch (error) {
      console.error("Error saving storage:", error);
    }
  }

  addWordSet(wordSet: WordSet, difficulty: Difficulty, topic: string): string {
    const wordSetId = crypto.randomUUID();
    const storedSet: StoredWordSet = {
      set: wordSet.words,
      id: wordSetId,
      title: wordSet.title,
      difficulty,
      wordIds: wordSet.words.map((word) => this.addWord(word, wordSetId).id),
      createdAt: new Date().toISOString(),
      usersTopic: topic,
    };
    this.storage.wordSets.push(storedSet);
    this.saveStorage();
    return wordSetId;
  }

  addBriefWordSet(
    briefWordSet: BriefWordSet,
    difficulty: Difficulty,
    topic: string,
  ): string {
    const wordSetId = crypto.randomUUID();
    const storedSet: StoredBriefWordSet = {
      set: briefWordSet.words,
      id: wordSetId,
      title: briefWordSet.title,
      usersTopic: topic,
      difficulty,
      createdAt: new Date().toISOString(),
    };
    this.storage.briefWordSets.push(storedSet);
    this.saveStorage();
    return wordSetId;
  }

  private addWord(word: Word, id: string): StoredWord {
    const existingWord = this.storage.words.find(
      (w) => w.word.original === word.original,
    );
    if (existingWord) {
      existingWord.setIds.push(id);
      return existingWord;
    }
    const storedWord: StoredWord = {
      word,
      id: crypto.randomUUID(),
      setIds: [id],
      createdAt: new Date().toISOString(),
    };
    this.storage.words.push(storedWord);
    return storedWord;
  }

  getWordSets(): StoredWordSet[] {
    return this.storage.wordSets;
  }

  getWordSetById(setId: string): StoredWordSet | undefined {
    return this.storage.wordSets.find((s) => s.id === setId);
  }

  getBriefWordSets(): StoredBriefWordSet[] {
    return this.storage.briefWordSets;
  }

  getBriefWordSetById(setId: string): StoredBriefWordSet | undefined {
    return this.storage.briefWordSets.find((s) => s.id === setId);
  }

  getWordsBySetId(setId: string): StoredWord[] {
    const set = this.storage.wordSets.find((s) => s.id === setId);
    if (!set) return [];
    return set.wordIds
      .map((id) => this.storage.words.find((w) => w.id === id))
      .filter((w): w is StoredWord => w !== undefined);
  }

  getWordsByBriefSetId(setId: string): StoredWord[] {
    const set = this.storage.briefWordSets.find((s) => s.id === setId);
    if (!set) return [];
    return set.set
      .map((word) =>
        this.storage.words.find((w) => w.word.original === word.original),
      )
      .filter((w): w is StoredWord => w !== undefined);
  }

  removeWordSet(id: string): void {
    const index = this.storage.wordSets.findIndex((s) => s.id === id);
    if (index !== -1) {
      const set = this.storage.wordSets[index]!;
      set.wordIds.forEach((wordId) => {
        const word = this.storage.words.find((w) => w.id === wordId);
        if (word && word.setIds.length === 1) {
          this.storage.words = this.storage.words.filter(
            (w) => w.id !== wordId,
          );
        }
      });
      this.storage.wordSets.splice(index, 1);
      this.saveStorage();
    }
  }

  deleteAllWordSets(): void {
    this.storage.wordSets = [];
    this.storage.briefWordSets = [];
    this.saveStorage();
  }

  // Convert a brief word set to a full word set with the same ID
  convertBriefToFullWordSet(briefSetId: string, wordSet: WordSet): string {
    // Find and remove the brief word set
    const briefIndex = this.storage.briefWordSets.findIndex(
      (s) => s.id === briefSetId,
    );

    if (briefIndex === -1) {
      console.error(`Brief word set with ID ${briefSetId} not found`);
      return this.addWordSet(wordSet, "Beginner", "Unknown"); // Fallback
    }

    const briefWordSet = this.storage.briefWordSets[briefIndex]!; // Non-null assertion is safe here because we checked index !== -1
    this.storage.briefWordSets.splice(briefIndex, 1);

    // Create full word set with the same ID
    const storedSet: StoredWordSet = {
      set: wordSet.words,
      id: briefWordSet.id,
      title: wordSet.title,
      difficulty: briefWordSet.difficulty,
      wordIds: wordSet.words.map(
        (word) => this.addWord(word, briefWordSet.id).id,
      ),
      createdAt: briefWordSet.createdAt,
      usersTopic: briefWordSet.usersTopic,
    };

    this.storage.wordSets.push(storedSet);
    this.saveStorage();

    return briefWordSet.id;
  }
}

let storageInstance: StorageManager | null = null;

export function getStorage(): StorageManager {
  if (typeof window !== "undefined" && !storageInstance) {
    storageInstance = new StorageManager();
  }
  return storageInstance ?? new StorageManager();
}
