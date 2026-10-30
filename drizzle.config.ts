import { defineConfig } from "drizzle-kit";
import fs from "node:fs";
import path from "node:path";

function requiredAdminEnv(name: string) {
  const value = process.env[name];
  if (!value?.trim()) {
    throw new Error(`Set ${name} in the administrative shell for remote database tooling`);
  }
  return value;
}

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
        accountId: requiredAdminEnv("CLOUDFLARE_ACCOUNT_ID"),
        databaseId: requiredAdminEnv("DATABASE_ID"),
        token: requiredAdminEnv("CLOUDFLARE_API_TOKEN"),
      },
    });
  }

  return defineConfig({
    ...schemaConfig,
    dbCredentials: { url: getLocalD1DB() },
  });
}

export default getConfig();
