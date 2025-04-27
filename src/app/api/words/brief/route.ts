import { streamObject } from "ai";
import { DEFAULT_SYSTEM_PROMPT } from "~/constants";
import { briefPackSchema, createPackSchema } from "~/lib/schemas";
import { model } from "~/lib/model";

export const maxDuration = 60;

export async function POST(req: Request) {
  const context = await req.json();
  const parsedContext = createPackSchema.safeParse(context);
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
            text: `Generate a pack of unique Lithuanian words with an appropriate title.
            - Each word must be a single word (not a phrase)
            - If a phrase is relevant, use its main word
            - Title should be 1-3 words only
            - DO NOT MENTION "LITHUANIAN", "WORDS" OR "VOCABULARY" in the title`,
          },
          {
            type: "text",
            text: `- Topic: "${parsedContext.data.topic}"
            - Difficulty: ${parsedContext.data.difficulty}
            - Number of words: ${parsedContext.data.count}`,
          },
        ],
      },
    ],
    schema: briefPackSchema,
    onFinish: ({ object }) => {
      const res = briefPackSchema.safeParse(object);
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
