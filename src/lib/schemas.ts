import { z } from "zod";

/**
 * CONSTANTS & ENUMS
 * Basic enum types used throughout the schema definitions
 */
export const DIFFICULTY_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;
export const DifficultyEnum = z.enum(DIFFICULTY_LEVELS);
export type Difficulty = z.infer<typeof DifficultyEnum>;

export const PartOfSpeechEnum = z.enum([
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
export type PartOfSpeech = z.infer<typeof PartOfSpeechEnum>;

export const GenderEnum = z.enum(["masculine", "feminine", "neuter"]);
export type Gender = z.infer<typeof GenderEnum>;

/**
 * COMMON FIELD DEFINITIONS
 * Reusable field definitions to avoid duplication
 */
const originalWord = z
  .string()
  .describe(
    "A single Lithuanian word in its canonical dictionary form (e.g., nominative singular for nouns, infinitive for verbs), using proper casing and diacritics. Must be a single word, not a phrase.",
  );

const translation = z
  .string()
  .describe(
    "The most accurate English equivalent for the specified meaning and context (capitalize only proper nouns).",
  );

const transcription = z
  .string()
  .describe(
    "Phonetic transcription in the International Phonetic Alphabet (IPA), enclosed in brackets to indicate pronunciation.",
  );

const commonMetadataFields = {
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
};

const title = z
  .string()
  .describe(
    "A concise, appropriate title for the word set (1-5 words) that captures the essence of the topic. Should be a general summary of the topic without mentioning 'vocabulary', 'words', or any other generation-related terms. The title should be in English.",
  );

/**
 * BRIEF SCHEMAS
 * Simplified schemas for basic word representation
 */
export const briefWordSchema = z.object({
  original: originalWord,
  translation: translation,
  transcription: transcription,
});
export type BriefWord = z.infer<typeof briefWordSchema>;

export const briefWordSetSchema = z.object({
  words: z.array(briefWordSchema),
  title: title,
});
export type BriefWordSet = z.infer<typeof briefWordSetSchema>;

/**
 * CORE SCHEMAS
 * Complete data structures for words and word sets
 */
export const wordSchema = briefWordSchema.extend({
  partOfSpeech: PartOfSpeechEnum.describe(
    "The grammatical category of the word (noun, verb, adjective, etc.).",
  ),
  gender: GenderEnum.describe(
    "The grammatical gender of the word in Lithuanian (masculine, feminine, or neuter); applicable for nouns and pronouns.",
  ),
  meanings: z
    .array(
      z.object({
        context: z
          .string()
          .describe(
            "A concise semantic domain or usage scenario for this meaning of the word (e.g., medical terminology, everyday conversation).",
          ),
        translation: translation,
        example: z
          .string()
          .describe(
            "A natural Lithuanian sentence demonstrating the word in this context, using correct grammar and word order.",
          ),
        exampleTranslation: z
          .string()
          .describe(
            "An accurate English translation of the example sentence, preserving meaning and tone.",
          ),
      }),
    )
    .min(1)
    .describe(
      "An array of distinct meanings/usages of the same original word, each with its own context and example. Only include truly different semantic meanings or usage contexts, not slight variations or closely related definitions. Each meaning should represent a significantly different way the same original word can be used.",
    ),
});
export type Word = z.infer<typeof wordSchema>;

export const wordSetSchema = z.object({
  words: z.array(wordSchema),
  title: title,
});
export type WordSet = z.infer<typeof wordSetSchema>;

/**
 * INPUT SCHEMAS
 * Structures for user inputs and form data
 */
export const createWordSetSchema = z.object({
  topic: z
    .string()
    .min(3, "Please enter a topic that's at least 3 characters long")
    .max(100, "Please enter a topic that's less than 100 characters"),
  difficulty: DifficultyEnum,
  count: z.number().min(5, "Min. 5 words").max(15, "Max. 15 words"),
});
export type CreateWordSet = z.infer<typeof createWordSetSchema>;

export const userDataSchema = z.object({
  difficulty: DifficultyEnum,
  knownWords: z.array(z.string()),
});
export type UserData = z.infer<typeof userDataSchema>;

/**
 * STORAGE SCHEMAS
 * Extended schemas with metadata for database persistence
 */
export const storedWordSchema = z.object({
  word: wordSchema,
  ...commonMetadataFields,
  setIds: z.array(z.string().uuid()),
});
export type StoredWord = z.infer<typeof storedWordSchema>;

const baseStoredSetSchema = z.object({
  ...commonMetadataFields,
  title: z.string(),
  difficulty: DifficultyEnum,
  usersTopic: z.string(),
});

export const storedWordSetSchema = baseStoredSetSchema.extend({
  set: z.custom<WordSet["words"]>(),
  wordIds: z.array(z.string().uuid()),
});
export type StoredWordSet = z.infer<typeof storedWordSetSchema>;

export const storedBriefWordSetSchema = baseStoredSetSchema.extend({
  set: z.custom<BriefWordSet["words"]>(),
});
export type StoredBriefWordSet = z.infer<typeof storedBriefWordSetSchema>;

export const storageSchema = z.object({
  words: z.array(storedWordSchema),
  wordSets: z.array(storedWordSetSchema),
  briefWordSets: z.array(storedBriefWordSetSchema),
});
export type Storage = z.infer<typeof storageSchema>;
