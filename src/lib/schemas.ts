import { z } from "zod";

export const wordSchema = z.object({
  original: z.string(),
  translation: z.string(),
  transcription: z.string().describe("Transcription of the word (in English)"),
  context: z.string().describe("Usage context of the word (in English)"),
  example: z.string(),
  exampleTranslation: z.string(),
});

export type Word = z.infer<typeof wordSchema>;

export const wordSetSchema = z.array(wordSchema);

export const UserDataSchema = z.object({
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  knownWords: z.string().array(),
});

export type UserData = z.infer<typeof UserDataSchema>;
