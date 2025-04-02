import { WordSetsList } from "~/components/wordsets-list";
import { auth } from "@clerk/nextjs/server";

export default async function WordSetsPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  return <WordSetsList />;
}
