import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { getDB } from "./db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "./db/schema";
import { env } from "./lib/env";

function createAuth(db: Awaited<ReturnType<typeof getDB>>) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: schema,
    }),
    secret: env.BETTER_AUTH_SECRET,
    socialProviders: {
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
      google: {
        prompt: "select_account",
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    plugins: [nextCookies()],
  });
}

let authInstance: ReturnType<typeof createAuth> | null = null;

export async function getAuth() {
  if (authInstance) {
    return authInstance;
  }
  const db = await getDB();

  authInstance = createAuth(db);

  return authInstance;
}
