import { cookies } from "next/headers";

export const validateApiKey = async (token: string) => {
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
    return { error: error.message };
  }
};

export const validateExistingToken = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  const openaiApiKey = cookieStore.get("openai-api-key")?.value;
  if (!openaiApiKey) {
    return false;
  }
  return true;
};
