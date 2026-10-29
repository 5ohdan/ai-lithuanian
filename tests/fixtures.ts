import type { BriefPack, Pack, StoredBriefPack, StoredFullPack } from "../src/lib/schemas";

export const briefPack: BriefPack = {
  title: "Greetings",
  enriched: false,
  words: [{ original: "Labas", translation: "Hello", transcription: "[ˈlɐbɐs]" }],
};

export const fullPack: Pack = {
  title: "Everyday Greetings",
  enriched: true,
  words: [
    {
      ...briefPack.words[0]!,
      partOfSpeech: "interjection",
      gender: "neuter",
      meanings: [
        {
          context: "Greeting a friend",
          translation: "Hello",
          example: "Labas, drauge!",
          exampleTranslation: "Hello, friend!",
        },
      ],
    },
  ],
};

export const storedBriefPack: StoredBriefPack = {
  id: "32c2fd54-1430-426c-b369-e159648f97c3",
  createdAt: "2026-01-01T12:00:00.000Z",
  status: "brief",
  title: briefPack.title,
  words: briefPack.words,
  difficulty: "Beginner",
  usersTopic: "greetings",
};

export const storedFullPack: StoredFullPack = {
  ...storedBriefPack,
  id: "ae494b53-d200-4f68-bb03-9dd2e627a4aa",
  status: "full",
  title: fullPack.title,
  words: fullPack.words,
};
