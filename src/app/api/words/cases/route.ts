import { streamObject } from "ai";
import { DEFAULT_SYSTEM_PROMPT } from "~/constants";
import {
  briefPackSchema,
  packSchema,
  briefWordSchema,
  wordSchema,
} from "~/lib/schemas";
import { model } from "~/lib/model";
import type { z } from "zod";
import { getUserId } from "~/lib/auth-utils";

export const maxDuration = 60;

function handleError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error("Unknown error", { cause: error });
}

function getFieldsToEnrich(): string[] {
  const briefWordFields = Object.keys(
    (briefWordSchema as z.ZodObject<z.ZodRawShape>).shape,
  );
  const wordFields = Object.keys(
    (wordSchema as z.ZodObject<z.ZodRawShape>).shape,
  );

  return wordFields.filter((field) => !briefWordFields.includes(field));
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = briefPackSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        parsed.error.errors.map((e) => e.message).join("\n"),
        {
          status: 400,
        },
      );
    }
    const briefPack = parsed.data;

    const fieldsToEnrich = getFieldsToEnrich();

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
              text: `Enrich the following Lithuanian pack by adding these missing fields for each word: ${fieldsToEnrich.join(", ")}. Use the provided original word, translation, and transcription as given.
              For each word, provide MULTIPLE meanings using the 'meanings' array field, where each meaning has its own context, example, and example translation. Words often have different contexts or usages, so try to provide at least 2 different meanings/contexts for each word when possible.`,
            },
            {
              type: "text",
              text: `Here is the brief pack:\n${JSON.stringify(briefPack)}`,
            },
          ],
        },
      ],
      schema: packSchema,
      onFinish: ({ object }) => {
        const res = packSchema.safeParse(object);
        if (res.error) {
          throw new Error(res.error.errors.map((e) => e.message).join("\n"));
        }
      },
      onError: (error) => {
        throw handleError(error);
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    const formattedError = handleError(error);
    return new Response(formattedError.message, { status: 500 });
  }
}
