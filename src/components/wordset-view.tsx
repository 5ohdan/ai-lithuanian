"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { StoredWordSet } from "~/lib/schemas";
import { getStorage } from "~/lib/storage";
import Link from "next/link";
import { LoadingScreen } from "./loading-screen";

const storage = getStorage();

export default function WordsetView({ wordsetId }: { wordsetId: string }) {
  const [wordset, setWordset] = useState<StoredWordSet | undefined>(undefined);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWordset = async () => {
      setIsLoading(true);
      try {
        const fetchedWordset = storage.getWordSetById(wordsetId);
        setWordset(fetchedWordset);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchWordset();
  }, [wordsetId]);

  const handlePrevious = useCallback(() => {
    if (!wordset) return;
    setActiveWordIndex((prev) =>
      prev === 0 ? wordset.set.length - 1 : prev - 1,
    );
  }, [wordset]);

  const handleNext = useCallback(() => {
    if (!wordset) return;
    setActiveWordIndex((prev) =>
      prev === wordset.set.length - 1 ? 0 : prev + 1,
    );
  }, [wordset]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        handlePrevious();
      } else if (e.key === "ArrowDown") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePrevious, handleNext]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!wordset) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center justify-center rounded-lg bg-zinc-50 p-8 text-center shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-zinc-900">
            Wordset Not Found
          </h2>
          <p className="mb-4 text-zinc-600">
            The wordset you&apos;re looking for doesn&apos;t exist or may have
            been deleted.
          </p>
          <Link
            href="/wordsets"
            className="flex w-fit items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Wordsets
          </Link>
        </div>
      </div>
    );
  }

  const activeWord = wordset.set[activeWordIndex];

  if (!activeWord) {
    return <div>Word not found</div>;
  }

  return (
    <div className="flex h-full w-full items-center justify-center px-10 pb-9 pt-28">
      <div className="flex h-full w-full max-w-[1024px] flex-col rounded-xl bg-white">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-[-1px] w-fit rounded-b-md bg-neutral-900 px-5 py-2 text-center text-white"
        >
          {wordset.topic}
        </motion.h1>
        <div className="flex-1 px-10 py-6">
          <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-[250px,1fr]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4"
            >
              <div className="flex flex-col gap-4">
                {wordset.set.map((word, index) => (
                  <motion.div
                    key={word.original}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setActiveWordIndex(index)}
                    className={`cursor-pointer rounded-lg p-3 transition-colors ${
                      index === activeWordIndex
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-50 hover:bg-zinc-100"
                    }`}
                  >
                    <div className="font-medium">{word.original}</div>
                    <div
                      className={`text-sm ${index === activeWordIndex ? "text-zinc-300" : "text-zinc-500"}`}
                    >
                      {word.translation}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeWord.original}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex h-full flex-col overflow-y-auto rounded-xl border border-zinc-200 bg-white transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between">
                    <motion.h2
                      layout
                      className="group flex cursor-pointer items-center text-2xl font-semibold tracking-tight text-zinc-900 hover:text-zinc-600"
                    >
                      {activeWord.original}
                    </motion.h2>

                    <div className="text-sm text-zinc-500">
                      {activeWordIndex + 1} of {wordset.set.length}
                    </div>
                  </div>

                  <motion.div
                    layout
                    className="mt-6 flex w-full max-w-xl flex-1 flex-col justify-center space-y-6"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-zinc-500">
                        Translation:
                      </p>
                      <p className="text-lg text-zinc-900">
                        {activeWord.translation}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-zinc-500">
                        Transcription:
                      </p>
                      <p className="font-mono text-lg text-zinc-700">
                        {activeWord.transcription}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-zinc-500">
                        Usage context:
                      </p>
                      <p className="text-zinc-700">{activeWord.context}</p>
                    </div>

                    <motion.div layout className="rounded-lg bg-zinc-50 p-4">
                      <p className="text-sm font-medium text-zinc-500">
                        Example:
                      </p>
                      <p className="mt-2 text-lg font-medium text-zinc-900">
                        {activeWord.example}
                      </p>
                      <p className="mt-1 text-zinc-600">
                        {activeWord.exampleTranslation}
                      </p>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
