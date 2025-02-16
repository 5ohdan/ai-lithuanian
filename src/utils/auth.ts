import { cookies } from "next/headers";
import { cache } from "react";

export const validateApiKey = cache(async (token: string) => {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      return { success: true };
    }
    return { success: false, error: "Invalid API key" };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

export const validateExistingToken = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  const openaiApiKey = cookieStore.get("openai-api-key")?.value;

  if (!openaiApiKey) return false;

  const tokenIsValid = await validateApiKey(openaiApiKey);
  return tokenIsValid.success;
};
