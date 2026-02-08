import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "./schema";
import { relations } from "./relations";

let db: DrizzleD1Database<typeof schema, typeof relations> | null = null;

export const getDB = async () => {
  if (db) {
    return db;
  }

  const { env } = await getCloudflareContext({ async: true });

  if (!env.DB) {
    throw new Error("D1 database not found");
  }

  db = drizzle(env.DB, { schema, relations, casing: "snake_case" });

  return db;
};
