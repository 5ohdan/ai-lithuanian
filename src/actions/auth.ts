import { cookies } from "next/headers";
import { API_KEY_COOKIE_NAME } from "~/constants";
import { validateApiKey } from "~/utils/auth";

export async function submitApiKey(formData: FormData) {
  "use server";
  const apiKey = formData.get("api-key") as string;
  const isValid = await validateApiKey(apiKey);
  if (!isValid.success || isValid.error) {
    return;
  }
  const cookieStore = await cookies();
  cookieStore.set(API_KEY_COOKIE_NAME, apiKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return;
}
