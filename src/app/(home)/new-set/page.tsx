import Link from "next/link";
import { WordSetGenerator } from "~/components/wordset-generator";

export default async function HomePage() {
  return (
    <main className="container mx-auto flex h-screen flex-col space-y-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Learn Words</h1>
        <Link
          href="/wordsets"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          View Word Sets →
        </Link>
      </div>
      <WordSetGenerator />
    </main>
  );
}
