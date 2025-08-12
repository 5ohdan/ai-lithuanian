"use client";

import type { StoredBriefPack, StoredPack } from "~/lib/schemas";
import { useCallback, useState } from "react";
import { Word as WordCard } from "./word";
import { motion } from "motion/react";

type CardStackProps = {
  pack: StoredPack | StoredBriefPack;
};

export function CardStack(props: CardStackProps) {
  const { pack } = props;
  const { words, title, id } = pack;

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
      className="h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      layout
      transition={{
        type: "spring",
        stiffness: 10,
        damping: 8,
        mass: 1.5,
        opacity: { duration: 0.4 },
      }}
    >
      {words[shownCard] && (
        <motion.div
          key={words[shownCard].original}
          className="h-full w-full"
          layout
          transition={{
            type: "spring",
            stiffness: 10,
            damping: 8,
            mass: 1.5,
          }}
        >
          <WordCard
            nextCard={handleNext}
            previousCard={handlePrevious}
            word={words[shownCard]}
            nextAvailable={nextAvailable}
            prevAvailable={prevAvailable}
            index={shownCard + 1}
            topic={title}
            id={id}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
