"use client";

import { getStorage } from "~/lib/storage";
import { CardStack } from "./card-stack";
import { useMemo } from "react";

const storage = getStorage();

export function CardsHandler({ wordSetId }: { wordSetId: string }) {
  const wordSet = useMemo(() => storage.getWordSetById(wordSetId), [wordSetId]);

  if (!wordSet) {
    return <div>Word set not found</div>;
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <CardStack words={wordSet.set} />
    </div>
  );
}
