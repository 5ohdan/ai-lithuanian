import { z } from "zod";

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

export const createWordSetSchema = z.object({
  topic: z.string(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  count: z.number(),
});

export const UserDataSchema = z.object({
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  knownWords: z.string().array(),
});

export const StoredWordSchema = z.object({
  word: z.custom<Word>(),
  id: z.string().uuid(),
  setIds: z.array(z.string().uuid()),
  createdAt: z.string().datetime(),
  // lastReviewed: z.string().datetime().optional(),
  // timesReviewed: z.number().default(0),
});

export const StoredWordSetSchema = z.object({
  set: z.custom<WordSet>(),
  id: z.string().uuid(),
  topic: z.string(),
  difficulty: z.string(),
  wordIds: z.array(z.string().uuid()),
  createdAt: z.string().datetime(),
});

export const StorageSchema = z.object({
  words: z.array(StoredWordSchema),
  wordSets: z.array(StoredWordSetSchema),
});

export type StoredWord = z.infer<typeof StoredWordSchema>;
export type StoredWordSet = z.infer<typeof StoredWordSetSchema>;
export type Storage = z.infer<typeof StorageSchema>;

export const wordSetSchema = z.array(wordSchema);
export const wordSetsSchema = z.array(wordSetSchema);

export type WordSets = z.infer<typeof wordSetsSchema>;

export type CreateWordSet = z.infer<typeof createWordSetSchema>;

export type WordSet = z.infer<typeof wordSetSchema>;

export type Word = z.infer<typeof wordSchema>;

export type UserData = z.infer<typeof UserDataSchema>;
