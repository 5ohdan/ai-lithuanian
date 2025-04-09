import WordsetView from "~/components/wordset-view";

export default async function WordsetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const wordsetId = (await params).id;

  return <WordsetView wordsetId={wordsetId} />;
}
