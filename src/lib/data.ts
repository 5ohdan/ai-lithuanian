import { type UserData, UserDataSchema } from "./schemas";

export const USER_DATA_KEY = "wordsLearningUserData";

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
        wordAttempts: {},
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
