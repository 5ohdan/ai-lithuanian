import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getServerEnv } from "./env";

export type Providers = "google" | "openai";

export const getModel = async (provider: Providers) => {
  const env = await getServerEnv();

  switch (provider) {
    case "google": {
      const google = createGoogleGenerativeAI({
        apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
      });
      return google("gemini-3.1-flash-lite");
    }
    default: {
      const google = createGoogleGenerativeAI({
        apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
      });
      return google("gemini-3.1-flash-lite");
    }
  }
};
