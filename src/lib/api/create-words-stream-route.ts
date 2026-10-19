import { streamObject } from "ai";
import type { z } from "zod";
import { getSystemPrompt } from "~/constants";
import { getModel } from "~/lib/model";
import { getUserId } from "~/lib/auth-utils";
import { checkRateLimit } from "~/lib/api/rate-limit";

export function handleError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error("Unknown error", { cause: error });
}

type WordsStreamRouteOptions<TInputSchema extends z.ZodType, TOutputSchema extends z.ZodType> = {
  /** Validates the request body. */
  inputSchema: TInputSchema;
  /** The schema streamed from the model. */
  outputSchema: TOutputSchema;
  buildUserPrompt: (input: z.output<TInputSchema>) => string;
};

/**
 * Shared shape of every `/api/words/*` route:
 * auth → rate limit → validate input → stream a validated object.
 *
 * Note: `onFinish` validation is log-only — the response is already
 * streaming when it runs; clients must validate the final object
 * themselves before persisting it.
 */
export function createWordsStreamRoute<
  TInputSchema extends z.ZodType,
  TOutputSchema extends z.ZodType,
>(options: WordsStreamRouteOptions<TInputSchema, TOutputSchema>) {
  const { inputSchema, outputSchema, buildUserPrompt } = options;

  return async function POST(req: Request): Promise<Response> {
    const userId = await getUserId();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const rateLimit = await checkRateLimit(`words:${userId}`);
    if (!rateLimit.ok) {
      return new Response("Too many requests — please try again in a minute.", { status: 429 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response("Request body must be valid JSON", { status: 400 });
    }

    const parsedInput = inputSchema.safeParse(body);
    if (!parsedInput.success) {
      return new Response(parsedInput.error.issues.map((e) => e.message).join("\n"), {
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
            content: buildUserPrompt(parsedInput.data),
          },
        ],
        schema: outputSchema,
        onFinish: ({ object }) => {
          const res = outputSchema.safeParse(object);
          if (res.error) {
            console.error(
              "Generated object failed schema validation:",
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
  };
}
