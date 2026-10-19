import { z } from "zod";
import { env } from "cloudflare:workers";

const serverEnvSchema = z.object({
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  GOOGLE_GENERATIVE_AI_API_KEY: z
    .string()
    .min(1, "GOOGLE_GENERATIVE_AI_API_KEY is required"),
  GITHUB_CLIENT_ID: z.string().min(1, "GITHUB_CLIENT_ID is required"),
  GITHUB_CLIENT_SECRET: z.string().min(1, "GITHUB_CLIENT_SECRET is required"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

// cloudflare:workers is typed via cloudflare-env.d.ts (wrangler types).
// Secrets come from .dev.vars locally and `wrangler secret put` in production.
export async function getServerEnv() {
  return serverEnvSchema.parse(env);
}
