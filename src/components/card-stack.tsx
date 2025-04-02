"use client";

import type { StoredWordSet } from "~/lib/schemas";
import { useCallback, useState } from "react";
import { Word as WordCard } from "./word";
import { motion, AnimatePresence } from "motion/react";

export function CardStack({ wordset }: { wordset: StoredWordSet }) {
  const [shownCard, setShownCard] = useState(0);

  const { set, topic } = wordset;
  const prevAvailable = shownCard > 0;
  const nextAvailable = shownCard < set.length - 1;

  const handleNext = useCallback(() => {
    if (shownCard === set.length - 1) {
      return;
    }
    setShownCard(shownCard + 1);
  }, [shownCard, set]);

  const handlePrevious = useCallback(() => {
    if (shownCard === 0) {
      return;
    }
    setShownCard(shownCard - 1);
  }, [shownCard]);

  if (set.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence mode="wait">
        {set[shownCard] && (
          <motion.div
            key={set[shownCard].original}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <WordCard
              nextCard={handleNext}
              previousCard={handlePrevious}
              word={set[shownCard]}
              nextAvailable={nextAvailable}
              prevAvailable={prevAvailable}
              index={shownCard + 1}
              topic={topic}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
