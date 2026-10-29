import { beforeEach, describe, expect, it, vi } from "vitest";
import type { z } from "zod";
import type * as Ai from "ai";
import { briefPack, fullPack } from "../../../tests/fixtures";
import { briefPackSchema, packSchema } from "../schemas";

type StreamOptions = {
  model: unknown;
  output: { schema: z.ZodType };
  instructions: string;
  prompt: string;
  onEnd: (result: { output: unknown }) => void;
  onError: (result: { error: unknown }) => void;
};

const mocks = vi.hoisted(() => ({
  getUserId: vi.fn<() => Promise<string | null>>(),
  checkRateLimit: vi.fn<(key: string) => Promise<{ ok: boolean }>>(),
  getModel: vi.fn<() => Promise<string>>(),
  streamText: vi.fn<(options: StreamOptions) => { textStream: ReadableStream<string> }>(),
}));

vi.mock("~/lib/auth-utils", () => ({ getUserId: mocks.getUserId }));
vi.mock("~/lib/api/rate-limit", () => ({ checkRateLimit: mocks.checkRateLimit }));
vi.mock("~/lib/model", () => ({ getModel: mocks.getModel }));
vi.mock("ai", async (importOriginal) => ({
  ...(await importOriginal<typeof Ai>()),
  streamText: mocks.streamText,
  Output: { object: (options: { schema: z.ZodType }) => options },
}));

import { POST as briefPOST } from "../../app/api/words/brief/route";
import { POST as enrichPOST } from "../../app/api/words/enrich/route";
import { handleError } from "./create-words-stream-route";

const input = { topic: "greetings", difficulty: "Beginner", count: 5 };
const routes = [
  { name: "brief", post: briefPOST, body: input, output: briefPack, schema: briefPackSchema },
  { name: "enrich", post: enrichPOST, body: briefPack, output: fullPack, schema: packSchema },
];

function request(body: unknown) {
  return new Request("https://example.invalid/api/words", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

function streamOptions() {
  const options = mocks.streamText.mock.calls[0]?.[0];
  if (!options) throw new Error("AI stream was not called");
  return options;
}

beforeEach(() => {
  mocks.getUserId.mockReset().mockResolvedValue("test-user");
  mocks.checkRateLimit.mockReset().mockResolvedValue({ ok: true });
  mocks.getModel.mockReset().mockResolvedValue("fake-model");
  mocks.streamText.mockReset().mockImplementation(({ output }) => ({
    textStream: new ReadableStream<string>({
      start(controller) {
        controller.enqueue(JSON.stringify(output.schema === packSchema ? fullPack : briefPack));
        controller.close();
      },
    }),
  }));
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

for (const route of routes) {
  describe(`${route.name} generation route`, () => {
    it("rejects unauthenticated requests before rate limiting or AI work", async () => {
      mocks.getUserId.mockResolvedValue(null);
      const response = await route.post(request(route.body));
      expect(response.status).toBe(401);
      expect(mocks.checkRateLimit).not.toHaveBeenCalled();
      expect(mocks.getModel).not.toHaveBeenCalled();
      expect(mocks.streamText).not.toHaveBeenCalled();
    });

    it("returns 429 when the user is rate limited without invoking AI", async () => {
      mocks.checkRateLimit.mockResolvedValue({ ok: false });
      const response = await route.post(request(route.body));
      expect(response.status).toBe(429);
      expect(mocks.checkRateLimit).toHaveBeenCalledWith("words:test-user");
      expect(mocks.getModel).not.toHaveBeenCalled();
      expect(mocks.streamText).not.toHaveBeenCalled();
    });

    it("returns 400 for malformed JSON without invoking AI", async () => {
      const response = await route.post(
        new Request("https://example.invalid", { method: "POST", body: "{broken" }),
      );
      expect(response.status).toBe(400);
      expect(await response.text()).toBe("Request body must be valid JSON");
      expect(mocks.getModel).not.toHaveBeenCalled();
      expect(mocks.streamText).not.toHaveBeenCalled();
    });

    it.each([null, {}, { words: [] }])("rejects schema-invalid input %j", async (body) => {
      const response = await route.post(request(body));
      expect(response.status).toBe(400);
      expect(mocks.getModel).not.toHaveBeenCalled();
      expect(mocks.streamText).not.toHaveBeenCalled();
    });

    it("passes the correct output schema and prompts to AI and returns its response", async () => {
      const response = await route.post(request(route.body));
      expect(response.status).toBe(200);
      expect(await response.text()).toBe(JSON.stringify(route.output));
      expect(mocks.getModel).toHaveBeenCalledWith();
      expect(mocks.streamText).toHaveBeenCalledTimes(1);
      const options = streamOptions();
      expect(options.model).toBe("fake-model");
      expect(options.output.schema).toBe(route.schema);
      expect(options.instructions).toBeTypeOf("string");
      expect(options.instructions.length).toBeGreaterThan(0);
      expect(options.prompt).toContain(route.name === "brief" ? "greetings" : "Labas");
    });

    it("returns 500 if the model cannot be initialized", async () => {
      mocks.getModel.mockRejectedValue(new Error("Provider unavailable"));
      const response = await route.post(request(route.body));
      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Provider unavailable");
      expect(mocks.streamText).not.toHaveBeenCalled();
    });

    it("returns 500 when stream setup fails", async () => {
      mocks.streamText.mockImplementation(() => {
        throw new Error("Stream unavailable");
      });
      const response = await route.post(request(route.body));
      expect(response.status).toBe(500);
    });

    it("logs invalid finished output and accepts valid finished output", async () => {
      await route.post(request(route.body));
      const options = streamOptions();
      options.onEnd({ output: route.output });
      expect(console.error).not.toHaveBeenCalled();
      options.onEnd({ output: {} });
      expect(console.error).toHaveBeenCalledWith(
        "Generated object failed schema validation:",
        expect.any(String),
      );
    });

    it("logs provider errors delivered after streaming starts", async () => {
      await route.post(request(route.body));
      const error = new Error("Stream interrupted");
      streamOptions().onError({ error });
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });
}

describe("error normalization", () => {
  it("preserves existing Error objects", () => {
    const error = new Error("Provider error");
    expect(handleError(error)).toBe(error);
  });

  it.each([null, "unexpected rejection", { failure: true }])(
    "wraps non-Error rejections (%j)",
    (cause) => {
      const error = handleError(cause);
      expect(error.message).toBe("Unknown error");
      expect(error.cause).toBe(cause);
    },
  );
});
