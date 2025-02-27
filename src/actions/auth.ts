import { API_KEY_COOKIE_NAME } from "~/constants";
import { validateApiKey } from "~/utils/auth";
import { setSecureCookie } from "~/utils/cookies";

export async function submitApiKey(formData: FormData) {
  "use server";
  const apiKey = formData.get("api-key") as string;
  const isValid = await validateApiKey(apiKey);
  if (!isValid.success || isValid.error) {
    return;
  }
  await setSecureCookie(API_KEY_COOKIE_NAME, apiKey);
  return;
}
