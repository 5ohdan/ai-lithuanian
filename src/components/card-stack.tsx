"use client";

import type { Word } from "~/lib/schemas";
import { useCallback, useState } from "react";
import { Word as WordCard } from "./word";

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
    <div className="pt-10">
      {words[shownCard] && (
        <WordCard
          key={words[shownCard].original}
          nextCard={handleNext}
          previousCard={handlePrevious}
          word={words[shownCard]}
          nextAvailable={nextAvailable}
          prevAvailable={prevAvailable}
        />
      )}
    </div>
  );
}
