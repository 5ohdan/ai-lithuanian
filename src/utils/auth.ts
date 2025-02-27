import { cache } from "react";
import { deleteCookie, getCookie } from "./cookies";
import { API_KEY_COOKIE_NAME } from "~/constants";

export type ValidationError = {
  code: "INVALID_KEY" | "NETWORK_ERROR" | "SERVER_ERROR" | "RATE_LIMIT";
  message: string;
};

// Extended interface for API responses that includes keyRemoved
export interface ValidationErrorResponse {
  error: ValidationError["code"];
  message: string;
  keyRemoved?: boolean;
}

type ValidationResult = {
  success: boolean;
  error?: ValidationError;
  keyRemoved?: boolean;
};

export const validateApiKey = cache(
  async (token: string): Promise<ValidationResult> => {
    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        return {
          success: false,
          error: {
            code: "INVALID_KEY",
            message: "Invalid API key",
          },
        };
      }

      if (response.status === 429) {
        return {
          success: false,
          error: {
            code: "RATE_LIMIT",
            message: "Rate limit exceeded, please try again later",
          },
        };
      }

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: "SERVER_ERROR",
            message: `Server error: ${response.status} - ${response.statusText}`,
          },
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: (error as Error).message || "Network error occurred",
        },
      };
    }
  },
);

export const validateExistingToken = async (): Promise<ValidationResult> => {
  const { exists, token } = await isTokenExists();

  if (!exists || !token) return { success: false };

  const tokenIsValid = await validateApiKey(token);

  if (!tokenIsValid.success) {
    await deleteCookie(API_KEY_COOKIE_NAME);
    return {
      ...tokenIsValid,
      keyRemoved: true,
    };
  }

  return tokenIsValid;
};

export const isTokenExists = async (): Promise<{
  exists: boolean;
  token?: string;
}> => {
  const openaiApiKey = await getCookie(API_KEY_COOKIE_NAME);
  return { exists: !!openaiApiKey, token: openaiApiKey };
};
