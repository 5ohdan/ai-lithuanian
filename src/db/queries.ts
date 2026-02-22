import { getDB } from ".";
import { eq } from "drizzle-orm";
import { user, packs } from "./schema";

const db = await getDB();

export const getUserById = async (userId: string) => {
  return await db.select().from(user).where(eq(user.id, userId)).limit(1);
};

export const getPackById = async (packId: string) => {
  return await db.select().from(packs).where(eq(packs.id, packId)).limit(1);
};
