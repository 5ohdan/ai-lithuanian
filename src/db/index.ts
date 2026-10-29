import { drizzle } from "drizzle-orm/d1";
import { env } from "cloudflare:workers";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import { relations } from "./relations";

let db: DrizzleD1Database<typeof relations> | null = null;

export const getDB = async () => {
  if (db) {
    return db;
  }

  if (!env.DB) {
    throw new Error("D1 database not found");
  }

  db = drizzle(env.DB, { relations });

  return db;
};
