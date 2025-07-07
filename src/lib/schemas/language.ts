import { z } from "zod";

export const PartOfSpeechEnum = z
  .enum([
    "noun",
    "verb",
    "adjective",
    "adverb",
    "pronoun",
    "numeral",
    "preposition",
    "particle",
    "conjunction",
    "interjection",
    "verbal interjection",
  ])
  .describe(
    "The grammatical category of the word (noun, verb, adjective, etc.).",
  );
export type PartOfSpeech = z.infer<typeof PartOfSpeechEnum>;

export const GenderEnum = z
  .enum(["masculine", "feminine", "neuter"])
  .describe(
    "The grammatical gender of the word in Lithuanian (masculine, feminine, or neuter); applicable for nouns and pronouns.",
  );
export type Gender = z.infer<typeof GenderEnum>;
