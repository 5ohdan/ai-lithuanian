import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", undefined);
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("public build settings", () => {
  it.each([undefined, "", "   "])("allows analytics to be disabled with %j", async (value) => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", value);
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", value);
    const { publicEnv } = await import("./public-env");
    expect(publicEnv.NEXT_PUBLIC_POSTHOG_KEY).toBeUndefined();
    expect(publicEnv.NEXT_PUBLIC_POSTHOG_HOST).toBeUndefined();
  });

  it("accepts a complete public analytics configuration", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "fake-public-project-key");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://example.invalid");
    expect((await import("./public-env")).publicEnv).toEqual({
      NEXT_PUBLIC_POSTHOG_KEY: "fake-public-project-key",
      NEXT_PUBLIC_POSTHOG_HOST: "https://example.invalid",
    });
  });

  it.each(["NEXT_PUBLIC_POSTHOG_KEY", "NEXT_PUBLIC_POSTHOG_HOST"])(
    "rejects an incomplete configuration containing only %s",
    async (key) => {
      vi.stubEnv(key, key.endsWith("HOST") ? "https://example.invalid" : "fake-public-project-key");
      await expect(import("./public-env")).rejects.toThrow("Set both NEXT_PUBLIC_POSTHOG_KEY");
    },
  );

  it("rejects an invalid analytics host", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "fake-public-project-key");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "not-a-url");
    await expect(import("./public-env")).rejects.toThrow();
  });
});
