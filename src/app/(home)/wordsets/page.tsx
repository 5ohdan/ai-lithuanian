"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import type { Storage } from "~/lib/schemas";
import { getStorage } from "~/lib/storage";

const storage = getStorage();

export default function WordSetsPage() {
  const [wordsets, setWordsets] = useState<Storage["wordSets"]>();
  useEffect(() => {
    const storedWordsets = storage.getWordSets();
    setWordsets(storedWordsets);
  }, []);

  return (
    <main className="container mx-auto space-y-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Word Sets</h1>
        <Link
          href="/new-set"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Create New Set
        </Link>
      </div>
      <div className="grid gap-4">
        {wordsets && wordsets.length > 0 ? (
          wordsets.map((wordSet) => (
            <Card key={wordSet.id}>
              <CardContent className="p-4">
                <h2 className="mb-2 text-xl font-semibold">{wordSet.topic}</h2>
                <p className="mb-2 text-sm text-gray-500">
                  Created: {new Date(wordSet.createdAt).toLocaleDateString()}
                </p>
                <div className="flex flex-wrap gap-2">
                  {wordSet.set.map((word, index) => (
                    <span
                      key={index}
                      className="rounded-md bg-gray-100 px-2 py-1 text-sm"
                    >
                      {word.original}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No word sets found. Generate some words to get started!
          </p>
        )}
      </div>
    </main>
  );
}
