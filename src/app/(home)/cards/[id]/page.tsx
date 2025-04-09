import { CardsHandler } from "~/components/cards-handler";

export default async function CardsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CardsHandler wordSetId={id} />;
}
