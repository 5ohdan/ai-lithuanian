import { streamObject } from "ai";
import { getSystemPrompt } from "~/constants";
import { briefPackSchema, packSchema } from "~/lib/schemas";
import { getModel } from "~/lib/model";
import { getUserId } from "~/lib/auth-utils";
import { getEnrichedPrompt } from "~/lib/prompts";
import { checkRateLimit } from "~/lib/api/rate-limit";

export const maxDuration = 60;

// Enrichment input is client-controlled: cap the word count so one request
// has a bounded API cost ceiling. Brief generation itself is capped at 15.
const MAX_PACK_WORDS = 50;

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

  const rateLimit = await checkRateLimit(`words:${userId}`);
  if (!rateLimit.ok) {
    return new Response("Too many requests — please try again in a minute.", { status: 429 });
  }

  const model = await getModel("google");

  try {
    const body = await req.json();
    const parsed = briefPackSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(parsed.error.issues.map((e) => e.message).join("\n"), {
        status: 400,
      });
    }
    const briefPack = parsed.data;
    if (briefPack.words.length === 0 || briefPack.words.length > MAX_PACK_WORDS) {
      return new Response(`Pack must contain between 1 and ${MAX_PACK_WORDS} words.`, {
        status: 400,
      });
    }

    const result = streamObject({
      model,
      messages: [
        {
          role: "system",
          content: getSystemPrompt(),
        },
        {
          role: "user",
          content: getEnrichedPrompt(briefPack),
        },
      ],
      schema: packSchema,
      onFinish: ({ object }) => {
        const res = packSchema.safeParse(object);
        if (res.error) {
          // Throwing here cannot change the response (the stream is already
          // committed); the client validates the final object before storing.
          // This log exists for observability only.
          console.error(
            "Generated pack failed schema validation:",
            res.error.issues.map((e) => e.message).join("\n"),
          );
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
