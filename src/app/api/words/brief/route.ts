import { streamObject } from "ai";
import { getSystemPrompt } from "~/constants";
import { briefPackSchema, packInputSchema } from "~/lib/schemas";
import { getModel } from "~/lib/model";
import { getUserId } from "~/lib/auth-utils";

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

  const context = await req.json();
  const parsedContext = packInputSchema.safeParse(context);
  if (!parsedContext.success) {
    return new Response(parsedContext.error.issues.map((e) => e.message).join("\n"), {
      status: 400,
    });
  }

  try {
    const model = await getModel("google");

    const result = streamObject({
      model,
      messages: [
        {
          role: "system",
          content: getSystemPrompt(),
        },
        {
          role: "user",
          content:
            `Generate a pack of unique Lithuanian words with an appropriate title.\n` +
            `- Each word must be a single capitalized word (not a phrase)\n` +
            `- If a phrase is relevant, use its main word\n` +
            `- Title should be 1-5 words. The title should be in English.\n` +
            `- DO NOT MENTION LANGUAGE NAME, "WORDS" OR "VOCABULARY" in the title\n` +
            `- Topic: "${parsedContext.data.topic}"\n` +
            `- Difficulty: ${parsedContext.data.difficulty}\n` +
            `- Number of words: ${parsedContext.data.count}`,
        },
      ],
      schema: briefPackSchema,
      onFinish: ({ object }) => {
        const res = briefPackSchema.safeParse(object);
        if (res.error) {
          throw new Error(res.error.issues.map((e) => e.message).join("\n"));
        }
      },
      onError: ({ error }) => {
        console.error(handleError(error));
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    const formattedError = handleError(error);
    return new Response(formattedError.message, { status: 500 });
  }
}
