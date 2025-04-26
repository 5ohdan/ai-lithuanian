"use client";

import { getStorage } from "~/lib/storage";
import { CardStack } from "./card-stack";
import { useEffect, useState, useRef } from "react";
import type { StoredWordSet, StoredBriefWordSet } from "~/lib/schemas";
import { LoadingScreen } from "./loading-screen";
import { useWordGeneration } from "~/hooks/useWordGeneration";

const storage = getStorage();

export function CardsHandler({ wordSetId }: { wordSetId: string }) {
  const [wordSet, setWordSet] = useState<
    StoredWordSet | StoredBriefWordSet | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const enrichmentAttempted = useRef(false);

  const { handleSubmit: handleEnrich } = useWordGeneration({
    mode: "enrich",
  });

  const triggerEnrichment = (briefWordSet: StoredBriefWordSet) => {
    if (!enrichmentAttempted.current) {
      enrichmentAttempted.current = true;
      handleEnrich(briefWordSet);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    enrichmentAttempted.current = false;

    const fullWordSet = storage.getWordSetById(wordSetId);
    if (fullWordSet) {
      setWordSet(fullWordSet);
      setIsLoading(false);
      return;
    }

    const briefResult = storage.getBriefWordSetById(wordSetId);
    if (briefResult) {
      setWordSet(briefResult);

      setTimeout(() => triggerEnrichment(briefResult), 0);
    }

    setIsLoading(false);
  }, [wordSetId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!wordSet) {
    return <div>Word set not found</div>;
  }

  return (
    <div className="flex h-full max-h-96 w-full max-w-[640px] flex-col items-center justify-center gap-4">
      <CardStack wordset={wordSet} />
    </div>
  );
}
