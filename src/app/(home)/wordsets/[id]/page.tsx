import { auth } from "@clerk/nextjs/server";
import WordsetView from "~/components/wordset-view";

export default async function WordsetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const wordsetId = (await params).id;
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  return <WordsetView wordsetId={wordsetId} />;
}
