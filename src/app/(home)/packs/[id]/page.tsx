import PackView from "~/components/pack-view";

export default async function PackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const packId = (await params).id;

  return <PackView packId={packId} />;
}
