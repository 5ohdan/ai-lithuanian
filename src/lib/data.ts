import {
  type UserData,
  UserDataSchema,
  type WordSet,
  wordSetsSchema,
} from "./schemas";

export const USER_DATA_KEY = "wordsLearningUserData";
export const WORD_SETS_KEY = "generatedWordSets";
export const GENERATED_WORDS_KEY = "previouslyGeneratedWords";

export function getUserData(): UserData {
  try {
    const storedData = localStorage.getItem(USER_DATA_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData) as string;
      return UserDataSchema.parse(parsedData);
    }
  } catch (error) {
    console.error("Error loading user data from localStorage:", error);
    localStorage.setItem(
      USER_DATA_KEY,
      JSON.stringify({
        difficulty: "Beginner",
        knownWords: [],
      }),
    );
  }

  return {
    difficulty: "Beginner",
    knownWords: [],
  };
}

export function updateUserData(userData: UserData): void {
  try {
    UserDataSchema.parse(userData);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error("Error saving user data to localStorage:", error);
  }
}

export function getWordSets(): WordSet[] {
  try {
    const storedSets = localStorage.getItem(WORD_SETS_KEY);
    if (storedSets) {
      const parsedSets = wordSetsSchema.safeParse(JSON.parse(storedSets));
      if (parsedSets.success) {
        return parsedSets.data;
      }
    }
  } catch (error) {
    console.error("Error loading word sets from localStorage: ", error);
  }
  return [];
}

function updateWordSets(wordSets: WordSet[]): void {
  try {
    const parsedWordSets = wordSetsSchema.safeParse(wordSets);
    if (!parsedWordSets.success) {
      console.error("Invalid word sets: ", parsedWordSets.error);
      return;
    }
    localStorage.setItem(WORD_SETS_KEY, JSON.stringify(parsedWordSets.data));
  } catch (error) {
    console.error("Error saving word sets to localStorage: ", error);
  }
}

export function addWordSet(wordSet: WordSet): void {
  const wordSets = getWordSets();
  wordSets.push(wordSet);
  updateWordSets(wordSets);
}

export function removeWordSet(wordSet: WordSet): void {
  const wordSets = getWordSets();
  const index = wordSets.indexOf(wordSet);
  if (index !== -1) {
    wordSets.splice(index, 1);
    updateWordSets(wordSets);
  }
}

export function clearWordSets(): void {
  localStorage.removeItem(WORD_SETS_KEY);
}

export function getPreviouslyGeneratedWords() {
  try {
    const storedWords = localStorage.getItem(GENERATED_WORDS_KEY);
    if (storedWords) {
      return JSON.parse(storedWords) as string[];
    }
  } catch (error) {
    console.error(
      "Error loading previously generated words from localStorage: ",
      error,
    );
  }
  return [];
}

function updatePreviouslyGeneratedWords(words: string[]) {
  try {
    localStorage.setItem(GENERATED_WORDS_KEY, JSON.stringify(words));
  } catch (error) {
    console.error(
      "Error saving previously generated words to localStorage: ",
      error,
    );
  }
}

export function addPreviouslyGeneratedWords(words: string[]) {
  try {
    const previouslyGeneratedWords = getPreviouslyGeneratedWords();
    const uniqueWords = [...new Set([...previouslyGeneratedWords, ...words])];
    updatePreviouslyGeneratedWords(uniqueWords);
  } catch (error) {
    console.error(
      "Error adding previously generated words to localStorage: ",
      error,
    );
  }
}
