import { getUser } from "~/lib/auth-utils";
import { CardsHandler } from "~/components/cards-handler";
import { redirect } from "next/navigation";

export default async function CardsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  const { id } = await params;

  return <CardsHandler packId={id} />;
}
