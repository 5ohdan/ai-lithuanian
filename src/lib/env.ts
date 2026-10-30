import { z } from "zod";
import { env } from "cloudflare:workers";

const authEnvSchema = z.object({
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  GITHUB_CLIENT_ID: z.string().min(1, "GITHUB_CLIENT_ID is required"),
  GITHUB_CLIENT_SECRET: z.string().min(1, "GITHUB_CLIENT_SECRET is required"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
});

const aiEnvSchema = z.object({
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1, "GOOGLE_GENERATIVE_AI_API_KEY is required"),
});

export type AuthEnv = z.infer<typeof authEnvSchema>;

// Validate only the settings needed by the current operation. Values come from
// .dev.vars locally and encrypted Worker secrets in production.
export async function getAuthEnv() {
  return authEnvSchema.parse(env);
}

export async function getAIEnv() {
  return aiEnvSchema.parse(env);
}
