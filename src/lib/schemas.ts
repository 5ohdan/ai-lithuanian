import { z } from "zod";

/**
 * Common enums and constants
 * These are used across multiple schemas to ensure consistency
 */
export const DIFFICULTY_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;
export const DifficultyEnum = z.enum(DIFFICULTY_LEVELS);
export type Difficulty = z.infer<typeof DifficultyEnum>;

const partOfSpeechEnum = z.enum([
  "noun",
  "verb",
  "adjective",
  "adverb",
  "pronoun",
  "numeral",
  "preposition",
  "particle",
  "conjunction",
  "interjection",
  "verbal interjection",
]);
export const PartOfSpeechEnum = partOfSpeechEnum;
export type PartOfSpeech = z.infer<typeof PartOfSpeechEnum>;

const genderEnum = z.enum(["masculine", "feminine", "neuter"]);
export const GenderEnum = genderEnum;
export type Gender = z.infer<typeof GenderEnum>;

/**
 * Base schemas
 * Define the core data structures for the application
 */
export const wordSchema = z.object({
  original: z
    .string()
    .describe(
      "The word in its dictionary form (e.g., nominative singular for nouns, infinitive for verbs) in Lithuanian.",
    ),
  translation: z
    .string()
    .describe(
      "The most common and accurate English translation for the given context.",
    ),
  partOfSpeech: partOfSpeechEnum.describe("The grammatical part of speech."),
  gender: genderEnum.describe("The gender of the word."),
  transcription: z
    .string()
    .describe(
      "Phonetic transcription using the International Phonetic Alphabet (IPA).",
    ),
  context: z.string().describe("Description of the typical usage context"),
  example: z
    .string()
    .describe(
      "A simple, clear example sentence in Lithuanian demonstrating the word's usage in its provided form.",
    ),
  exampleTranslation: z
    .string()
    .describe("Accurate English translation of the example sentence."),
});
export type Word = z.infer<typeof wordSchema>;

export const wordSetSchema = z.array(wordSchema);
export type WordSet = z.infer<typeof wordSetSchema>;

export const wordSetsSchema = z.array(wordSetSchema);
export type WordSets = z.infer<typeof wordSetsSchema>;

/**
 * Input schemas
 * These define the structure of user inputs for various operations
 */
export const createWordSetSchema = z.object({
  topic: z.string().min(3, "Topic is required").max(50, "Topic is too long"),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  count: z.number().min(5, "Minimum 5 words").max(15, "Maximum 15 words"),
});
export type CreateWordSet = z.infer<typeof createWordSetSchema>;

export const userDataSchema = z.object({
  difficulty: DifficultyEnum,
  knownWords: z.array(z.string()),
});
export type UserData = z.infer<typeof userDataSchema>;

/**
 * Storage schemas
 * These extend the base schemas with additional metadata needed for persistence
 */
export const storedWordSchema = z.object({
  word: z.custom<Word>(),
  id: z.string().uuid(),
  setIds: z.array(z.string().uuid()),
  createdAt: z.string().datetime(),
  // Uncomment if review functionality is implemented
  // lastReviewed: z.string().datetime().optional(),
  // timesReviewed: z.number().default(0),
});
export type StoredWord = z.infer<typeof storedWordSchema>;

export const storedWordSetSchema = z.object({
  set: z.custom<WordSet>(),
  id: z.string().uuid(),
  topic: z.string(),
  difficulty: DifficultyEnum,
  wordIds: z.array(z.string().uuid()),
  createdAt: z.string().datetime(),
});
export type StoredWordSet = z.infer<typeof storedWordSetSchema>;

export const storageSchema = z.object({
  words: z.array(storedWordSchema),
  wordSets: z.array(storedWordSetSchema),
});
export type Storage = z.infer<typeof storageSchema>;

// TODO: Implement this

// // Brief version - only what's shown in the Word card component
// export const briefWordSchema = z.object({
//   original: z.string()
//     .describe("Lithuanian word"),
//   translation: z.string()
//     .describe("Primary English translation"),
//   transcription: z.string()
//     .describe("Basic pronunciation guide"),
// });

// // Detailed version - everything else needed for the detailed view
// export const detailedWordSchema = briefWordSchema.extend({
//   context: z.string()
//     .describe("Usage context"),
//   example: z.string()
//     .describe("Example sentence"),
//   exampleTranslation: z.string()
//     .describe("Example translation"),
//   partOfSpeech: z.object({
//     type: z.string(),
//     gender: z.string().optional(),
//   }),
//   meanings: z.array(z.object({
//     label: z.string(),
//     definition: z.string(),
//     example: z.string().optional(),
//     exampleTranslation: z.string().optional(),
//   })),
//   relatedForms: z.array(z.object({
//     word: z.string(),
//     translation: z.string(),
//     note: z.string().optional(),
//   })).optional(),
// });
