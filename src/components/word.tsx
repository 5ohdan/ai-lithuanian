import type { Word } from "~/lib/schemas";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { useEffect } from "react";

export function Word({
  word,
  topic,
  index,
  nextCard,
  previousCard,
  nextAvailable,
  prevAvailable,
}: {
  word: Word;
  topic: string;
  index: number;
  nextCard: () => void;
  previousCard: () => void;
  nextAvailable: boolean;
  prevAvailable: boolean;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" && nextAvailable) {
        nextCard();
      } else if (event.key === "ArrowLeft" && prevAvailable) {
        previousCard();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nextCard, previousCard, nextAvailable, prevAvailable]);

  return (
    <motion.div
      key={word.original}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex max-h-96 w-full max-w-[640px] flex-col"
    >
      <Card className="grid h-full w-full grid-rows-[auto_1fr_auto] rounded-[20px] border border-neutral-400/50">
        <CardHeader className="mt-[-1px] w-fit justify-self-center rounded-b-md bg-neutral-900 px-5 py-2 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <CardTitle>{topic}</CardTitle>
          </motion.div>
        </CardHeader>
        <CardContent className="mx-16 my-6 w-full max-w-[520px] rounded-2xl border border-neutral-300/50 px-7 py-12">
          <motion.div
            className="space-x-2 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <span className="text-2xl font-semibold text-neutral-800">
              {word.original}
            </span>
            <span className="text-xl text-neutral-800/75">
              [{word.transcription}]
            </span>
          </motion.div>

          <hr className="mx-7 my-6 w-full place-self-center border-neutral-300/75" />

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <p className="text-xl text-neutral-800">{word.translation}</p>
          </motion.div>
        </CardContent>

        <CardFooter className="items-center justify-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Button
              onClick={previousCard}
              disabled={!prevAvailable}
              variant="outline"
            >
              ←
            </Button>
          </motion.div>
          <motion.span
            className="text-center text-lg font-bold text-neutral-800"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            {index}
          </motion.span>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Button
              onClick={nextCard}
              disabled={!nextAvailable}
              variant="outline"
            >
              →
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
