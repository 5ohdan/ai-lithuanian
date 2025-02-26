import Link from "next/link";
import { WordSetsList } from "~/components/wordsets-list";

export default async function WordSetsPage() {
  return (
    <main className="container mx-auto space-y-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Word Sets</h1>
        <Link
          href="/new-set"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Create New Set →
        </Link>
      </div>
      <WordSetsList />
    </main>
  );
}
