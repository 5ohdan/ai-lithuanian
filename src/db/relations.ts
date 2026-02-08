import { defineRelations } from "drizzle-orm/relations";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  words: {
    meanings: r.many.meanings({
      from: r.words.id,
      to: r.meanings.wordId,
    }),
    packWords: r.many.packWords({
      from: r.words.id,
      to: r.packWords.wordId,
    }),
  },
  packs: {
    packWords: r.many.packWords({
      from: r.packs.id,
      to: r.packWords.packId,
    }),
  },
  packWords: {
    pack: r.one.packs({
      from: r.packWords.packId,
      to: r.packs.id,
    }),
    word: r.one.words({
      from: r.packWords.wordId,
      to: r.words.id,
    }),
  },
  meanings: {
    word: r.one.words({
      from: r.meanings.wordId,
      to: r.words.id,
    }),
  },
  userData: {
    user: r.one.user({
      from: r.userData.userId,
      to: r.user.id,
    }),
  },
}));
