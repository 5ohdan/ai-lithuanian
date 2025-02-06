import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Input } from "~/components/ui/input";
import { validateApiKey, validateExistingToken } from "~/utils/auth";

export default async function KeyFormPage() {
  const isValid = await validateExistingToken();
  if (isValid) redirect("/");
  return (
    <main className="flex h-screen items-center justify-center">
      <form
        className="flex flex-col gap-2 rounded-md border border-neutral-700 p-4"
        action={async (formData: FormData) => {
          "use server";
          const apiKey = formData.get("api-key") as string;
          const isValid = await validateApiKey(apiKey);
          if (!isValid.success || isValid.error) {
            return { error: "Invalid API key" };
          }
          const cookieStore = await cookies();
          cookieStore.set("openai-api-key", apiKey, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });
        }}
      >
        <label htmlFor="api-key">API Key</label>
        <Input id="api-key" name="api-key" type="text" />
      </form>
    </main>
  );
}
