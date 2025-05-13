import "server-only";
import { eq } from "drizzle-orm";
import { getDB } from "~/db";
import * as schema from "~/db/schema";
import type { Pack, Word } from "~/db/schema";

type WordSetWithWords = Pack & {
  words: Word[];
};

type GroupedWordSets = Record<string, WordSetWithWords>;

export async function getUserWordSets(
  userId: string,
): Promise<WordSetWithWords[]> {
  const db = await getDB();

  const wordSets = await db
    .select({
      id: schema.packs.id,
      title: schema.packs.title,
      difficulty: schema.packs.difficulty,
      usersTopic: schema.packs.usersTopic,
      createdAt: schema.packs.createdAt,
      userId: schema.packs.userId,
      words: schema.words,
    })
    .from(schema.packs)
    .leftJoin(schema.packWords, eq(schema.packWords.packId, schema.packs.id))
    .leftJoin(schema.words, eq(schema.words.id, schema.packWords.wordId))
    .where(eq(schema.packs.userId, userId));

  // Group words by pack
  const groupedWordSets = wordSets.reduce<GroupedWordSets>((acc, curr) => {
    const { words, ...pack } = curr;
    acc[pack.id] ??= {
      ...pack,
      words: [],
    };
    if (words && typeof words === "object") {
      acc[pack.id]!.words.push(words);
    }
    return acc;
  }, {});

  return Object.values(groupedWordSets);
}
