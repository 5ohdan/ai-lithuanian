import { z } from "zod";
import { originalWord, translation, transcription, meanings } from "./atom-fields";
import { GenderEnum, PartOfSpeechEnum } from "./language";

export const briefWordSchema = z.object({
  original: originalWord,
  translation,
  transcription,
});
export type BriefWord = z.infer<typeof briefWordSchema>;

export const wordSchema = briefWordSchema.extend({
  partOfSpeech: PartOfSpeechEnum,
  gender: GenderEnum,
  meanings,
});
export type Word = z.infer<typeof wordSchema>;
