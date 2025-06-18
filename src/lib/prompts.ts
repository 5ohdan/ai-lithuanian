import { type BriefPack, briefWordSchema, wordSchema } from "./schemas";
import type { z } from "zod";

export function getBriefPrompt(topic: string) {
  return `Generate a pack of unique Lithuanian words with an appropriate title.
  - Each word must be a single capitalized word (not a phrase)
  - If a phrase is relevant, use its main word
  - Title should be 1-5 words. The title should be in English.
  - DO NOT MENTION LANGUAGE NAME, "WORDS" OR "VOCABULARY" in the title
  - Topic: "${topic}"
  `;
}

function getFieldsToEnrich(): string {
  const briefWordFields = Object.keys(
    (briefWordSchema as z.ZodObject<z.ZodRawShape>).shape,
  );
  const wordFields = Object.keys(
    (wordSchema as z.ZodObject<z.ZodRawShape>).shape,
  );

  return wordFields
    .filter((field) => !briefWordFields.includes(field))
    .join(", ");
}

export function getEnrichedPrompt(briefPack: BriefPack) {
  return `Enrich the following Lithuanian pack by adding these missing fields for each word: ${getFieldsToEnrich()}. 
  Use the provided original word, translation, and transcription as given.
  For each word, provide MULTIPLE meanings using the 'meanings' array field, where each meaning has its own context, example, and example translation. 
  Words often have different contexts or usages, so try to provide at least 2 different meanings/contexts for each word when possible.
  Here is the brief pack:
  ${JSON.stringify(briefPack, null, 2)}`;
}
