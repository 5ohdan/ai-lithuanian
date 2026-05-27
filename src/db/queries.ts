import { getDB } from ".";
import { eq } from "drizzle-orm";
import { user, packs } from "./schema";

export const getUserById = async (userId: string) => {
  const db = await getDB();
  return await db.select().from(user).where(eq(user.id, userId)).limit(1);
};

export const getPackById = async (packId: string) => {
  const db = await getDB();
  return await db.select().from(packs).where(eq(packs.id, packId)).limit(1);
};
