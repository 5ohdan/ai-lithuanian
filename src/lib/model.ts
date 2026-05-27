import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getServerEnv } from "./env";

export type Providers = "google";

export const getModel = async (provider: Providers) => {
  const env = await getServerEnv();
  const google = createGoogleGenerativeAI({
    apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
  });
  const googleAI = google("gemini-3.1-flash-lite");

  switch (provider) {
    case "google":
      return googleAI;
    default:
      return googleAI;
  }
};
