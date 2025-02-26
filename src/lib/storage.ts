import {
  type StoredWord,
  type StoredWordSet,
  type Storage,
  StorageSchema,
  type WordSet,
  type Word,
} from "./schemas";

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
      return { words: [], wordSets: [] };
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = StorageSchema.parse(JSON.parse(data));
        return parsed;
      }
    } catch (error) {
      console.error("Error loading storage:", error);
    }
    return { words: [], wordSets: [] };
  }

  private saveStorage(): void {
    if (!this.isClient) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.storage));
    } catch (error) {
      console.error("Error saving storage:", error);
    }
  }

  addWordSet(wordSet: WordSet, topic: string, difficulty: string): void {
    const wordSetId = crypto.randomUUID();
    const storedSet: StoredWordSet = {
      set: wordSet,
      id: wordSetId,
      topic,
      difficulty,
      wordIds: wordSet.map((word) => this.addWord(word, wordSetId).id),
      createdAt: new Date().toISOString(),
    };
    this.storage.wordSets.push(storedSet);
    this.saveStorage();
  }

  findExistingWordSet(
    topic: string,
    difficulty: string,
  ): StoredWordSet | undefined {
    return this.storage.wordSets.find(
      (set) => set.topic === topic && set.difficulty === difficulty,
    );
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

  getWordsBySetId(setId: string): StoredWord[] {
    const set = this.storage.wordSets.find((s) => s.id === setId);
    if (!set) return [];
    return set.wordIds
      .map((id) => this.storage.words.find((w) => w.id === id))
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
}

// Create a client-side only instance
let storageInstance: StorageManager | null = null;

export function getStorage(): StorageManager {
  if (typeof window !== "undefined" && !storageInstance) {
    storageInstance = new StorageManager();
  }
  return storageInstance ?? new StorageManager();
}
