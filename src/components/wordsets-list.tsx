"use client";

import { useEffect, useState } from "react";
import type { Storage } from "~/lib/schemas";
import { getStorage } from "~/lib/storage";
import { motion } from "motion/react";
import { LoadingScreen } from "./loading-screen";
import { WordSetsListItem } from "./wordsets-list-item";

const storage = getStorage();

export function WordSetsList() {
  const [wordsets, setWordsets] = useState<Storage["wordSets"]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedWordsets = storage.getWordSets();
    setWordsets(storedWordsets);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!wordsets || wordsets.length === 0) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="rounded-lg bg-white/60 p-4 text-center text-neutral-900"
      >
        No word sets found. Create some words to get started!
      </motion.p>
    );
  }

  return (
    <div className="h-full w-full flex-col items-center justify-center px-10 pb-9 pt-28 xl:w-5/6">
      <div className="flex max-h-full w-full flex-col gap-4 rounded-2xl bg-white px-8 py-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold"
        >
          Your wordsets
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex h-fit w-full flex-col gap-4 overflow-y-scroll rounded-xl border border-neutral-300/50 p-6"
        >
          {wordsets.map((wordSet, index) => (
            <WordSetsListItem
              key={wordSet.id}
              wordSet={wordSet}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
