"use client";

import type { Word } from "~/lib/schemas";
import { useCallback, useState } from "react";
import { Word as WordCard } from "./word";
import { motion, AnimatePresence } from "motion/react";

export function CardStack({ words }: { words: Word[] }) {
  const [shownCard, setShownCard] = useState(0);

  const prevAvailable = shownCard > 0;
  const nextAvailable = shownCard < words.length - 1;

  const handleNext = useCallback(() => {
    if (shownCard === words.length - 1) {
      return;
    }
    setShownCard(shownCard + 1);
  }, [shownCard, words]);

  const handlePrevious = useCallback(() => {
    if (shownCard === 0) {
      return;
    }
    setShownCard(shownCard - 1);
  }, [shownCard]);

  if (words.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="flex h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence mode="wait">
        {words[shownCard] && (
          <motion.div
            key={words[shownCard].original}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <WordCard
              nextCard={handleNext}
              previousCard={handlePrevious}
              word={words[shownCard]}
              nextAvailable={nextAvailable}
              prevAvailable={prevAvailable}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
