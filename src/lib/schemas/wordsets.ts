import { z } from "zod";
import { briefWordSchema, wordSchema } from "./words";
import { title } from "./atom-fields";

export const briefPackSchema = z.object({
  words: z.array(briefWordSchema),
  title,
});
export type BriefPack = z.infer<typeof briefPackSchema>;

export const packSchema = briefPackSchema.extend({
  words: z.array(wordSchema),
});
export type Pack = z.infer<typeof packSchema>;
