"use client";

import { getStorage } from "~/lib/storage";
import { CardStack } from "./card-stack";
import { useEffect, useState } from "react";
import type { StoredWordSet } from "~/lib/schemas";
import { LoadingScreen } from "./loading-screen";

const storage = getStorage();

export function CardsHandler({ wordSetId }: { wordSetId: string }) {
  const [wordSet, setWordSet] = useState<StoredWordSet | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const result = storage.getWordSetById(wordSetId);
    setWordSet(result);
    setIsLoading(false);
  }, [wordSetId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!wordSet) {
    return <div>Word set not found</div>;
  }

  return (
    <div className="flex h-full max-h-96 w-full max-w-[640px] items-center justify-center">
      <CardStack wordset={wordSet} />
    </div>
  );
}
