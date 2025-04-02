import { CardsHandler } from "~/components/cards-handler";
import { auth } from "@clerk/nextjs/server";

export default async function CardsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  return <CardsHandler wordSetId={id} />;
}
