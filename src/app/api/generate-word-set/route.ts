import { auth } from "@clerk/nextjs/server";
import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { API_KEY_COOKIE_NAME, DEFAULT_SYSTEM_PROMPT } from "~/constants";
import {
  type CreateWordSet,
  createWordSetSchema,
  wordSchema,
  wordSetSchema,
} from "~/lib/schemas";
import { validateApiKey, type ValidationErrorResponse } from "~/utils/auth";
import { getCookie } from "~/utils/cookies";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const context = (await req.json()) as CreateWordSet;
  const parsedContext = createWordSetSchema.safeParse(context);
  if (!parsedContext.success) {
    return new Response(
      parsedContext.error.errors.map((e) => e.message).join("\n"),
      { status: 400 },
    );
  }
  const apiKey = await getCookie(API_KEY_COOKIE_NAME);
  if (!apiKey) {
    return new Response("Unauthorized", { status: 401 });
  }

  const tokenIsValid = await validateApiKey(apiKey);
  if (!tokenIsValid.success) {
    const errorResponse: ValidationErrorResponse = {
      error: tokenIsValid.error?.code ?? "INVALID_KEY",
      message: tokenIsValid.error?.message ?? "Invalid API key",
      keyRemoved: tokenIsValid.keyRemoved ?? false,
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
