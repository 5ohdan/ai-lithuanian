import { createWordsStreamRoute } from "~/lib/api/create-words-stream-route";
import { briefPackSchema, packInputSchema } from "~/lib/schemas";
import { getBriefPrompt } from "~/lib/prompts";

export const maxDuration = 60;

export const POST = createWordsStreamRoute({
  inputSchema: packInputSchema,
  outputSchema: briefPackSchema,
  buildUserPrompt: ({ topic, difficulty, count }) => getBriefPrompt(topic, difficulty, count),
});
