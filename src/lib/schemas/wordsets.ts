import { z } from "zod";
import { briefWordSchema, wordSchema } from "./words";
import { title } from "./atom-fields";

/** Hard ceiling for pack size, whichever side produces the words. Bounds the API cost of one request. */
export const MAX_PACK_WORDS = 50;

export const briefPackSchema = z.object({
  words: z.array(briefWordSchema).min(1).max(MAX_PACK_WORDS),
  enriched: z.boolean().default(false),
  title,
});
export type BriefPack = z.infer<typeof briefPackSchema>;

export const packSchema = briefPackSchema.extend({
  words: z.array(wordSchema),
});
export type Pack = z.infer<typeof packSchema>;
