import { z } from "zod";

export const wordSchema = z.object({
  original: z.string(),
  translation: z.string(),
  transcription: z.string(),
  context: z.string(),
  example: z.string(),
});

export type Word = z.infer<typeof wordSchema>;

export const wordSetSchema = z.array(wordSchema);
