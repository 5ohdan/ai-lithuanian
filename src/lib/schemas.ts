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

export const wordSetSchema = z.array(wordSchema);

export type CreateWordSet = z.infer<typeof createWordSetSchema>;

export type WordSet = z.infer<typeof wordSetSchema>;

export type Word = z.infer<typeof wordSchema>;

export type UserData = z.infer<typeof UserDataSchema>;
