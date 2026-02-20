"use client";

import { getStorage } from "~/lib/storage";
import { CardStack } from "./card-stack";
import { useEffect, useState, useRef } from "react";
import type { StoredPack, StoredBriefPack } from "~/lib/schemas";
import { LoadingScreen } from "./loading-screen";
import { useWordGeneration } from "~/hooks/use-word-generation";

const storage = getStorage();

type CardsHandlerProps = {
  packId: string;
};

export function CardsHandler(props: CardsHandlerProps) {
  const { packId } = props;

  const [pack, setPack] = useState<StoredPack | StoredBriefPack | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const enrichmentAttempted = useRef(false);

  const { handleSubmit: handleEnrich } = useWordGeneration({
    mode: "enrich",
  });

  const triggerEnrichment = (briefPack: StoredBriefPack) => {
    if (!enrichmentAttempted.current) {
      enrichmentAttempted.current = true;
      handleEnrich(briefPack);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    enrichmentAttempted.current = false;

    const fullPack = storage.getPackById(packId);
    if (fullPack) {
      setPack(fullPack);
      setIsLoading(false);
      return;
    }

    const briefResult = storage.getBriefPackById(packId);
    if (briefResult) {
      setPack(briefResult);

      setTimeout(() => triggerEnrichment(briefResult), 0);
    }

    setIsLoading(false);
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
