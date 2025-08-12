import { z } from "zod";
import { commonMetadataFields } from "./atom-fields";
import { briefWordSchema, wordSchema } from "./words";
import { DifficultyEnum } from "./inputs";

export const storedWordSchema = z.object({
  word: wordSchema,
  ...commonMetadataFields,
  packIds: z.array(z.string().uuid()),
});
export type StoredWord = z.infer<typeof storedWordSchema>;

const baseStoredSetSchema = z.object({
  ...commonMetadataFields,
  title: z.string(),
  difficulty: DifficultyEnum,
  usersTopic: z.string(),
});

export const storedPackSchema = baseStoredSetSchema.extend({
  words: wordSchema.array(),
});
export type StoredPack = z.infer<typeof storedPackSchema>;

export const storedBriefPackSchema = baseStoredSetSchema.extend({
  words: briefWordSchema.array(),
});
export type StoredBriefPack = z.infer<typeof storedBriefPackSchema>;

export const storageSchema = z.object({
  words: z.array(storedWordSchema),
  packs: z.array(storedPackSchema),
  briefPacks: z.array(storedBriefPackSchema),
});
export type Storage = z.infer<typeof storageSchema>;
