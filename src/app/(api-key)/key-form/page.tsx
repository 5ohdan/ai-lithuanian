import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { validateApiKey, validateExistingToken } from "~/utils/auth";

async function submitApiKey(formData: FormData) {
  "use server";
  const apiKey = formData.get("api-key") as string;
  const isValid = await validateApiKey(apiKey);
  if (!isValid.success || isValid.error) {
    return;
  }
  const cookieStore = await cookies();
  cookieStore.set("openai-api-key", apiKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return;
}

export default async function KeyFormPage() {
  const { success, error } = await validateExistingToken();

  if (success) {
    return (
      <main className="flex h-screen items-center justify-center">
        <Link href={"/new-set"}>
          <Button>Go to home page →</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="flex h-screen items-center justify-center">
      <form
        className="flex w-2/3 flex-col space-y-2 rounded-md border border-neutral-500/40 p-4 md:p-10"
        action={submitApiKey}
      >
        {error && (
          <span className="rounded-md bg-red-200 p-2 text-red-500">
            {error.message}
          </span>
        )}
        <Label htmlFor="api-key">API Key</Label>
        <Input id="api-key" name="api-key" type="text" required />
        <Button type="submit">Validate the key</Button>
      </form>
    </main>
  );
}
