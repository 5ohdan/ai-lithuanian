import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { cookies } from "next/headers";
import { DEFAULT_SYSTEM_PROMPT } from "~/costants";
import {
  type CreateWordSet,
  createWordSetSchema,
  wordSchema,
  wordSetSchema,
} from "~/lib/schemas";
import { validateApiKey } from "~/utils/auth";

export const maxDuration = 60;

export async function POST(req: Request) {
  const context = (await req.json()) as CreateWordSet;
  const parsedContext = createWordSetSchema.safeParse(context);
  if (!parsedContext.success) {
    return new Response(
      parsedContext.error.errors.map((e) => e.message).join("\n"),
      { status: 400 },
    );
  }
  const apiKey = (await cookies()).get("openai-api-key")?.value;
  if (!apiKey) {
    return new Response("Unauthorized", { status: 401 });
  }

  const tokenIsValid = await validateApiKey(apiKey);
  if (!tokenIsValid.success) {
    return new Response("Token is NOT valid", { status: 401 });
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
        content: DEFAULT_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Generate ${context.count} ${context.difficulty}-level Lithuanian words suitable for '${context.topic}' topic.`,
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
