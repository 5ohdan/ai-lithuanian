import { google } from "@ai-sdk/google";

const googleAI = google("gemini-2.5-flash");

export type Providers = "google";

export const getModel = (provider: Providers) => {
  switch (provider) {
    case "google":
      return googleAI;
    default:
      return googleAI;
  }
};
