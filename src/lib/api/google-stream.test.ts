import { beforeEach, describe, expect, it, vi } from "vitest";
import { briefPack, fullPack } from "../../../tests/fixtures";

vi.mock("~/lib/env", () => ({
  getAIEnv: async () => ({ GOOGLE_GENERATIVE_AI_API_KEY: "fake-google-key" }),
}));
vi.mock("~/lib/auth-utils", () => ({ getUserId: async () => "test-user" }));
vi.mock("~/lib/api/rate-limit", () => ({ checkRateLimit: async () => ({ ok: true }) }));

import { POST as briefPOST } from "../../app/api/words/brief/route";
import { POST as enrichPOST } from "../../app/api/words/enrich/route";

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

// Exercise the real Google provider and AI SDK against a fake HTTP boundary.
// No credentials, provider requests, production writes or AI charges are involved.
describe("AI SDK 7 Google structured streams", () => {
  for (const route of [
    {
      name: "brief",
      post: briefPOST,
      input: { topic: "greetings", difficulty: "Beginner", count: 5 },
      output: briefPack,
    },
    { name: "enrich", post: enrichPOST, input: briefPack, output: fullPack },
  ]) {
    it(`preserves the ${route.name} JSON text stream consumed by useObject`, async () => {
      const json = JSON.stringify(route.output);
      const midpoint = Math.floor(json.length / 2);
      const frames = [json.slice(0, midpoint), json.slice(midpoint)].map((text, index) => ({
        candidates: [
          {
            content: { role: "model", parts: [{ text }] },
            ...(index === 1 ? { finishReason: "STOP" } : {}),
          },
        ],
        ...(index === 1
          ? {
              usageMetadata: {
                promptTokenCount: 10,
                candidatesTokenCount: 20,
                totalTokenCount: 30,
              },
            }
          : {}),
      }));
      fetchMock.mockResolvedValue(
        new Response(frames.map((frame) => `data: ${JSON.stringify(frame)}\n\n`).join(""), {
          headers: { "Content-Type": "text/event-stream" },
        }),
      );
      const response = await route.post(
        new Request(`https://example.invalid/api/words/${route.name}`, {
          method: "POST",
          body: JSON.stringify(route.input),
          headers: { "Content-Type": "application/json" },
        }),
      );
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("text/plain");
      expect(JSON.parse(await response.text())).toEqual(route.output);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0]!;
      expect(url).toBe(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:streamGenerateContent?alt=sse",
      );
      expect(new Headers(init?.headers).get("x-goog-api-key")).toBe("fake-google-key");
      if (typeof init?.body !== "string") throw new Error("Expected a JSON request body");
      const body = JSON.parse(init.body) as {
        generationConfig: {
          responseMimeType: string;
          responseSchema?: unknown;
          responseJsonSchema?: unknown;
        };
      };
      expect(body.generationConfig.responseMimeType).toBe("application/json");
      expect(
        body.generationConfig.responseSchema ?? body.generationConfig.responseJsonSchema,
      ).toBeDefined();
    });
  }
});
