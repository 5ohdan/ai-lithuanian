import { auth } from "@clerk/nextjs/server";
import { WordSetGenerator } from "~/components/wordset-generator";

export default async function NewSetPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  return <WordSetGenerator />;
}
