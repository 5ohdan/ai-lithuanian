import { createGoogle } from "@ai-sdk/google";
import { getServerEnv } from "./env";

export const getModel = async () => {
  const env = await getServerEnv();
  const google = createGoogle({
    apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
  });
  return google("gemini-3.1-flash-lite");
};
