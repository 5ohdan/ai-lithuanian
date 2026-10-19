import { createWordsStreamRoute } from "~/lib/api/create-words-stream-route";
import { briefPackSchema, packSchema } from "~/lib/schemas";
import { getEnrichedPrompt } from "~/lib/prompts";

export const maxDuration = 60;

// The words cap (1–50) lives on briefPackSchema — same schema covers AI output.
export const POST = createWordsStreamRoute({
  inputSchema: briefPackSchema,
  outputSchema: packSchema,
  buildUserPrompt: getEnrichedPrompt,
});
