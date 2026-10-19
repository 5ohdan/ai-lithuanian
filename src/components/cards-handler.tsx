"use client";

import { getStorage } from "~/lib/storage";
import { CardStack } from "./card-stack";
import { useEffect, useState, useRef } from "react";
import type { StoredPack, StoredBriefPack } from "~/lib/schemas";
import { LoadingScreen } from "./loading-screen";
import { useEnrichment } from "~/hooks/use-word-generation";

const storage = getStorage();

type CardsHandlerProps = {
  packId: string;
};

export function CardsHandler(props: CardsHandlerProps) {
  const { packId } = props;

  const [pack, setPack] = useState<StoredPack | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const enrichmentAttempted = useRef(false);

  const { handleEnrichment } = useEnrichment();

  const triggerEnrichment = (briefPack: StoredBriefPack) => {
    if (!enrichmentAttempted.current) {
      enrichmentAttempted.current = true;
      handleEnrichment(briefPack);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    enrichmentAttempted.current = false;

    const found = storage.getPackById(packId);

    if (found?.status === "full") {
      setPack(found);
    } else if (found?.status === "brief") {
      setPack(found);
      setTimeout(() => triggerEnrichment(found), 0);
    }

    setIsLoading(false);
  }, [packId]);

  // Keep the rendered cards in sync with storage: when enrichment completes
  // the pack object becomes `full` and the stack re-renders with new words.
  useEffect(() => {
    return storage.subscribe(() => {
      setPack(storage.getPackById(packId));
    });
  }, [packId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!pack) {
    return <div>Pack not found</div>;
  }

  return (
    <div className="flex h-full max-h-96 w-full max-w-[640px] items-center justify-center">
      <CardStack pack={pack} />
    </div>
  );
}
