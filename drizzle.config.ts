import { defineConfig } from "drizzle-kit";
import fs from "node:fs";
import path from "node:path";

function getLocalD1DB() {
  try {
    const basePath = path.resolve(".wrangler/state/v3/d1");
    const dbFile = fs
      .readdirSync(basePath, { encoding: "utf-8", recursive: true })
      .find((f) => f.endsWith(".sqlite"));

    if (!dbFile) {
      throw new Error(`.sqlite file not found in ${basePath}`);
    }

    const url = path.resolve(basePath, dbFile);
    return url;
  } catch (err) {
    throw new Error("Initialize local D1 with pnpm db:migrate before opening Drizzle Studio", {
      cause: err,
    });
  }
}

// Generating/checking migrations only reads the schema and snapshots.
const needsConnection = process.argv.some((arg) => ["studio", "push", "pull"].includes(arg));

const schemaConfig = {
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  dialect: "sqlite" as const,
};

function getConfig() {
  if (!needsConnection) return defineConfig(schemaConfig);

  if (process.env.NODE_ENV === "production") {
    return defineConfig({
      ...schemaConfig,
      driver: "d1-http",
      dbCredentials: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
        databaseId: process.env.DATABASE_ID,
        token: process.env.CLOUDFLARE_API_TOKEN,
      },
    });
  }

  return defineConfig({
    ...schemaConfig,
    dbCredentials: { url: getLocalD1DB() },
  });
}

export default getConfig();
