import { cookies } from "next/headers";
import { cache } from "react";

export type ValidationError = {
  code: "INVALID_KEY" | "NETWORK_ERROR" | "SERVER_ERROR";
  message: string;
};

type ValidationResult = {
  success: boolean;
  error?: ValidationError;
};

export const validateApiKey = cache(
  async (token: string): Promise<ValidationResult> => {
    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) return { success: true };

      if (response.status === 401) {
        return {
          success: false,
          error: {
            code: "INVALID_KEY",
            message: "Invalid API key",
          },
        };
      }

      return {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: `Server error: ${response.status}`,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: (error as Error).message,
        },
      };
    }
  },
);

export const validateExistingToken = async (): Promise<ValidationResult> => {
  const { exists, token } = await isTokenExists();
  if (!exists || !token) return { success: false };
  const tokenIsValid = await validateApiKey(token);
  return tokenIsValid;
};

export const isTokenExists = async (): Promise<{
  exists: boolean;
  token?: string;
}> => {
  const cookieStore = await cookies();
  const openaiApiKey = cookieStore.get("openai-api-key")?.value;
  return { exists: !!openaiApiKey, token: openaiApiKey };
};
