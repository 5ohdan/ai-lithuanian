import { z } from "zod";
import { commonMetadataFields } from "./atom-fields";
import { briefWordSchema, wordSchema } from "./words";
import { DifficultyEnum } from "./inputs";

/**
 * A pack is a single entity: `brief` packs (generated words only)
 * are enriched in place into `full` packs (part of speech, gender,
 * meanings). The status is persisted so brief and full data live in
 * one array and no cross-array conversion exists.
 */
export const storedBriefPackSchema = z.object({
  ...commonMetadataFields,
  status: z.literal("brief"),
  words: briefWordSchema.array(),
  title: z.string(),
  difficulty: DifficultyEnum,
  usersTopic: z.string(),
});
export type StoredBriefPack = z.infer<typeof storedBriefPackSchema>;

export const storedFullPackSchema = z.object({
  ...commonMetadataFields,
  status: z.literal("full"),
  words: wordSchema.array(),
  title: z.string(),
  difficulty: DifficultyEnum,
  usersTopic: z.string(),
});
export type StoredFullPack = z.infer<typeof storedFullPackSchema>;

export const storedPackSchema = z.discriminatedUnion("status", [
  storedBriefPackSchema,
  storedFullPackSchema,
]);
export type StoredPack = z.infer<typeof storedPackSchema>;

export type Storage = {
  packs: StoredPack[];
};

export const storageSchema = z.union([
  // Legacy shape (pre-consolidation): separate packs/briefPacks arrays and
  // an unused top-level words list. Transformed in place on load so existing
  // user data migrates automatically.
  z
    .object({
      words: z.array(z.unknown()).optional(),
      packs: storedFullPackSchema.array(),
      briefPacks: storedBriefPackSchema.array(),
    })
    .transform((legacy): Storage => ({
      packs: [
        ...legacy.packs.map((pack) => ({ ...pack, status: "full" as const })),
        ...legacy.briefPacks.map((pack) => ({ ...pack, status: "brief" as const })),
      ],
    })),
  // Current shape.
  z.object({ packs: storedPackSchema.array() }),
]);

export type StorageData = z.output<typeof storageSchema>;
