import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { cookies } from "next/headers";
import { wordSchema, wordSetSchema } from "~/lib/schemas";

export const maxDuration = 60;

export async function POST() {
  const apiKey = (await cookies()).get("openai-api-key")?.value;
  if (!apiKey) {
    return new Response("Unauthorized", { status: 401 });
  }
  const openai = createOpenAI({
    apiKey,
    compatibility: "strict",
  });
  const result = streamObject({
    model: openai("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content:
          "You are a teacher specialized in teaching Lithuanian. Provide the user with Lithuanian vocabulary words for beginners.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Generate 5 intermediate-level Lithuanian words suitable for everyday conversations.",
          },
        ],
      },
    ],
    schema: wordSchema,
    output: "array",
    onFinish: ({ object }) => {
      const res = wordSetSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
  });

  return result.toTextStreamResponse();
}
