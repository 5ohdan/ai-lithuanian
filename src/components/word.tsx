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
  nextCard,
  previousCard,
  nextAvailable,
  prevAvailable,
}: {
  word: Word;
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
      className="flex h-full"
    >
      <Card className="grid h-full w-full grid-rows-[auto_1fr_auto]">
        <CardHeader>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <CardTitle className="text-4xl underline underline-offset-2">
              {word.original}
            </CardTitle>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto">
          <motion.div
            className="flex flex-col space-y-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <span className="text-sm font-medium text-neutral-400">
              Translation:
            </span>
            <p className="text-lg text-neutral-800">{word.translation}</p>
          </motion.div>
          <motion.div
            className="flex flex-col space-y-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <span className="text-sm font-medium text-neutral-400">
              Transcription:
            </span>
            <p className="text-lg text-neutral-800">{word.transcription}</p>
          </motion.div>
          <motion.div
            className="flex flex-col space-y-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <span className="text-sm font-medium text-neutral-400">
              Usage context:
            </span>
            <p className="text-lg text-neutral-800">{word.context}</p>
          </motion.div>
          <motion.div
            className="mt-4 flex flex-col space-y-1 rounded-lg bg-neutral-300/50 p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <span className="text-sm">Example:</span>
            <p className="text-lg font-semibold">{word.example}</p>
            <p className="text-neutral-500 opacity-40 hover:text-neutral-800 hover:opacity-100">
              {word.exampleTranslation}
            </p>
          </motion.div>
        </CardContent>
        <CardFooter className="items-end justify-between">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Button
              onClick={previousCard}
              disabled={!prevAvailable}
              className="w-24"
            >
              Previous
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Button
              onClick={nextCard}
              disabled={!nextAvailable}
              className="w-24"
            >
              Next
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
