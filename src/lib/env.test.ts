import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ env: {} as Record<string, string> }));
vi.mock("cloudflare:workers", () => ({ env: mocks.env }));

import { getAIEnv, getAuthEnv } from "./env";

const authSettings = {
  BETTER_AUTH_SECRET: "fake-test-auth-secret-at-least-32-characters",
  GITHUB_CLIENT_ID: "fake-github-client",
  GITHUB_CLIENT_SECRET: "fake-github-secret",
  GOOGLE_CLIENT_ID: "fake-google-client",
  GOOGLE_CLIENT_SECRET: "fake-google-secret",
};

beforeEach(() => {
  for (const key of Object.keys(mocks.env)) delete mocks.env[key];
});

describe("Worker runtime settings", () => {
  it("validates auth without requiring AI credentials", async () => {
    Object.assign(mocks.env, authSettings);
    expect(await getAuthEnv()).toEqual(authSettings);
  });

  it("validates AI without requiring auth or deployment credentials", async () => {
    mocks.env.GOOGLE_GENERATIVE_AI_API_KEY = "fake-ai-key";
    expect(await getAIEnv()).toEqual({ GOOGLE_GENERATIVE_AI_API_KEY: "fake-ai-key" });
  });

  it.each(Object.keys(authSettings))("requires the auth setting %s", async (key) => {
    Object.assign(mocks.env, authSettings);
    delete mocks.env[key];
    await expect(getAuthEnv()).rejects.toThrow(key);
  });

  it("rejects an empty AI key", async () => {
    mocks.env.GOOGLE_GENERATIVE_AI_API_KEY = "";
    await expect(getAIEnv()).rejects.toThrow("GOOGLE_GENERATIVE_AI_API_KEY is required");
  });

  it("excludes unrelated credentials from the validated settings", async () => {
    Object.assign(mocks.env, authSettings, {
      GOOGLE_GENERATIVE_AI_API_KEY: "fake-ai-key",
      CLOUDFLARE_API_TOKEN: "fake-admin-token",
    });
    expect(await getAuthEnv()).toEqual(authSettings);
    expect(await getAIEnv()).toEqual({ GOOGLE_GENERATIVE_AI_API_KEY: "fake-ai-key" });
  });
});
