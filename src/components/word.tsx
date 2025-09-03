import type { Word, BriefWord } from "~/lib/schemas";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ListTree } from "lucide-react";
import { voces } from "~/assets/fonts";

type WordProps = {
  word: Word | BriefWord;
  topic: string;
  index: number;
  nextCard: () => void;
  previousCard: () => void;
  nextAvailable: boolean;
  prevAvailable: boolean;
  id: string;
};
export function Word(props: WordProps) {
  const {
    word,
    topic,
    index,
    nextCard,
    previousCard,
    nextAvailable,
    prevAvailable,
    id,
  } = props;

  const router = useRouter();

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
      className="max-h-96 w-full max-w-[640px] px-2"
      layout
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.5,
      }}
    >
      <Card className="grid h-full w-full grid-rows-[auto_1fr_auto] rounded-2xl border border-neutral-400/50 p-4 sm:rounded-[20px]">
        <CardHeader className="w-fit justify-self-center rounded-lg bg-neutral-900 px-5 py-2 text-center text-white">
          <CardTitle className="text-base sm:text-lg">{topic}</CardTitle>
        </CardHeader>
        <AnimatePresence mode="wait">
          <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              mass: 0.5,
            }}
          >
            <CardContent className="my-5 flex w-full max-w-[520px] flex-col gap-4 rounded-xl border border-neutral-300/50 py-8 shadow-md sm:mx-auto sm:w-full sm:px-7 sm:py-12">
              <motion.div
                layout
                className="space-x-2 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  mass: 0.5,
                }}
              >
                <span className="text-base font-bold text-neutral-800 sm:text-2xl">
                  {word.original}
                </span>
                <span
                  className={`text-sm tracking-wide text-neutral-800/75 sm:text-xl ${voces.className}`}
                >
                  {word.transcription}
                </span>
              </motion.div>

              <hr className="w-5/6 place-self-center border-neutral-300/75 sm:w-full" />

              <motion.div
                layout
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  mass: 0.5,
                }}
              >
                <p className="text-sm text-neutral-800 sm:text-xl">
                  {word.translation}
                </p>
              </motion.div>
            </CardContent>
          </motion.div>
        </AnimatePresence>

        <CardFooter className="items-center justify-center gap-4">
          <Button
            onClick={previousCard}
            disabled={!prevAvailable}
            variant="outline"
            title="Previous word"
            className="size-10"
          >
            ←
          </Button>

          <span className="text-center text-sm font-bold text-neutral-800 sm:text-lg">
            {index}
          </span>
          {nextAvailable ? (
            <Button
              onClick={nextCard}
              disabled={!nextAvailable}
              variant="outline"
              title="Next word"
              className="size-10"
            >
              →
            </Button>
          ) : (
            <Button
              variant="outline"
              title="Detailed view"
              onClick={() => {
                router.push(`/packs/${id}`);
              }}
              className="size-10"
            >
              <ListTree className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
