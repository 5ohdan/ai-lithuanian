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

/**
 * Base schemas
 * Define the core data structures for the application
 */
export const wordSchema = z.object({
  original: z.string(),
  translation: z.string(),
  transcription: z
    .string()
    .describe(
      "Transcription of the word (in English) to help to understand pronounciation",
    ),
  context: z.string().describe("Usage context of the word (in English)"),
  example: z.string().describe("Example of usage in original language"),
  exampleTranslation: z
    .string()
    .describe("Translation of the example of usage (in English)"),
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
  topic: z.string(),
  difficulty: DifficultyEnum,
  count: z.number(),
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
