import { streamObject } from "ai";
import { DEFAULT_SYSTEM_PROMPT } from "~/constants";
import { briefPackSchema, packSchema } from "~/lib/schemas";
import { getModel } from "~/lib/model";
import { getUserId } from "~/lib/auth-utils";
import { getEnrichedPrompt } from "~/lib/prompts";

export const maxDuration = 60;

function handleError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error("Unknown error", { cause: error });
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const model = getModel('google')

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
              text: getEnrichedPrompt(briefPack),
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
