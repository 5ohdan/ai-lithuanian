import { createGoogle } from "@ai-sdk/google";
import { getAIEnv } from "./env";

export const getModel = async () => {
  const env = await getAIEnv();
  const google = createGoogle({
    apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
  });
  return google("gemini-3.1-flash-lite");
};
