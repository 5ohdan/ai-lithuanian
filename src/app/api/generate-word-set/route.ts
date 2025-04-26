import { streamObject } from "ai";
import { DEFAULT_SYSTEM_PROMPT } from "~/constants";
import {
  type CreateWordSet,
  createWordSetSchema,
  wordSetSchema,
} from "~/lib/schemas";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { model } from "~/lib/model";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const { success } = await env.RATE_LIMITER.limit({
    key: "generate-word-set",
  });
  if (!success) {
    return new Response(
      "429 Failure – rate limit exceeded for generate-word-set: You have 1 request per 1 minute",
      {
        status: 429,
      },
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const context = (await req.json()) as CreateWordSet;
  const parsedContext = createWordSetSchema.safeParse(context);
  if (!parsedContext.success) {
    return new Response(
      parsedContext.error.errors.map((e) => e.message).join("\n"),
      { status: 400 },
    );
  }

  const result = streamObject({
    model,
    messages: [
      {
        role: "system",
        content: DEFAULT_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Generate a set of unique Lithuanian words with these requirements:
                  - Topic: "${context.topic}"
                  - Difficulty: ${context.difficulty}
                  - Number of words: ${context.count}
                  - Each word must be a single word (not a phrase)
                  - If a phrase is relevant, use its main word and include the full phrase in the context field
                  - For each word, provide MULTIPLE meanings in the 'meanings' array, where each meaning has its own context, example, and exampleTranslation. Words often have different contexts or usages, so try to provide at least 2 different meanings/contexts for each word when possible
                  - Provide a concise title (3-5 words) for the word set.`,
          },
        ],
      },
    ],
    schema: wordSetSchema,
    onFinish: ({ object }) => {
      const res = wordSetSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
    onError: (error) => {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Unknown error", { cause: error });
    },
  });

  return result.toTextStreamResponse();
}
