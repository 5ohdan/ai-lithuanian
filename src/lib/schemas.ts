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
      "The Lithuanian word in its canonical dictionary form (e.g., nominative singular for nouns, infinitive for verbs), using proper casing and diacritics.",
    ),
  translation: z
    .string()
    .describe(
      "The most accurate English equivalent for the specified meaning and context (capitalize only proper nouns).",
    ),
  partOfSpeech: PartOfSpeechEnum.describe(
    "The grammatical category of the word (noun, verb, adjective, etc.).",
  ),
  gender: GenderEnum.describe(
    "The grammatical gender of the word in Lithuanian (masculine, feminine, or neuter); applicable for nouns and pronouns.",
  ),
  transcription: z
    .string()
    .describe(
      "Phonetic transcription in the International Phonetic Alphabet (IPA), enclosed in brackets to indicate pronunciation.",
    ),
  context: z
    .string()
    .describe(
      "A concise semantic domain or usage scenario for the word (e.g., medical terminology, everyday conversation).",
    ),
  example: z
    .string()
    .describe(
      "A natural Lithuanian sentence demonstrating the word in context, using correct grammar and word order.",
    ),
  exampleTranslation: z
    .string()
    .describe(
      "An accurate English translation of the example sentence, preserving meaning and tone.",
    ),
});
export type Word = z.infer<typeof wordSchema>;

export const wordSetSchema = z.object({
  words: z.array(wordSchema),
  title: z
    .string()
    .describe(
      "A concise, appropriate title for the word set (3-5 words) that captures the essence of the topic.",
    ),
});
export type WordSet = z.infer<typeof wordSetSchema>;

/**
 * Input schemas
 * These define the structure of user inputs for various operations
 */
export const createWordSetSchema = z.object({
  topic: z
    .string()
    .min(3, "Please enter a topic that's at least 3 characters long")
    .max(100, "Please enter a topic that's less than 100 characters"),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  count: z.number().min(5, "Min. 5 words").max(15, "Max. 15 words"),
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
  set: z.custom<WordSet["words"]>(),
  id: z.string().uuid(),
  title: z.string(),
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
