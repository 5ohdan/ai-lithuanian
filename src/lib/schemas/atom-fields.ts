import { z } from "zod";

export const originalWord = z
  .string()
  .describe(
    "A single Lithuanian word in its canonical dictionary form (e.g., nominative singular for nouns, infinitive for verbs), using proper casing and diacritics. Must be a single word, not a phrase.",
  );

export const translation = z
  .string()
  .describe(
    "The most accurate English equivalent for the specified meaning and context, properly capitalized.",
  );

export const transcription = z
  .string()
  .describe(
    "Phonetic transcription in the International Phonetic Alphabet (IPA), enclosed in brackets to indicate pronunciation.",
  );

export const commonMetadataFields = {
  id: z.uuid(),
  createdAt: z.iso.datetime(),
};

export const title = z
  .string()
  .describe(
    "A concise, appropriate title for the pack (1-5 words) that captures the essence of the topic. Should be a general summary of the topic without mentioning 'vocabulary', 'words', or any other generation-related terms. The title should be in English.",
  );

const meaning = z.object({
  context: z
    .string()
    .describe(
      "A concise semantic domain or usage scenario for this meaning of the word (e.g., medical terminology, everyday conversation).",
    ),
  translation,
  example: z
    .string()
    .describe(
      "A natural Lithuanian sentence demonstrating the word in this context, using correct grammar and word order.",
    ),
  exampleTranslation: z
    .string()
    .describe(
      "An accurate English translation of the example sentence, preserving meaning and tone.",
    ),
});

export type Meaning = z.infer<typeof meaning>;

export const meanings = z
  .array(meaning)
  .min(1)
  .describe(
    "Array of distinct meanings for the word, each with context and example. Include all different semantic meanings or usage contexts, but exclude similar contexts that are essentially the same meaning with only slight differences.",
  );
