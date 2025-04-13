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
        <div className="flex flex-col items-center justify-center rounded-lg bg-white/75 p-4 text-center text-neutral-900 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-neutral-900">
            Wordset Not Found
          </h2>
          <p className="mb-4 text-neutral-900">
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
          className="mx-auto mt-[-1px] w-fit rounded-b-md bg-neutral-900 px-5 py-2 text-center text-2xl font-bold text-white"
        >
          {wordset.topic}
        </motion.h1>
        <div className="flex-1 overflow-hidden px-10 py-6">
          <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-[1fr,1fr]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-h-full overflow-y-auto rounded-xl border border-neutral-200 bg-white p-4"
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
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100/80 hover:bg-neutral-200/80"
                    }`}
                  >
                    <p className="flex items-center gap-2">
                      <span
                        className={`flex h-5 w-7 items-center justify-center rounded-sm border bg-neutral-900 text-xs text-white ${index === activeWordIndex ? "border-white" : "border-transparent"}`}
                      >
                        lt
                      </span>
                      <span
                        className={`text-xl font-medium ${
                          index === activeWordIndex
                            ? "text-white"
                            : "text-neutral-900"
                        }`}
                      >
                        {word.original}
                      </span>
                    </p>
                    <p
                      className={`text-sm ${index === activeWordIndex ? "text-white" : "text-neutral-900"}`}
                    >
                      {word.translation}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeWord.original}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex h-full flex-col overflow-y-auto rounded-xl border border-neutral-200 bg-white transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2 pb-5">
                    <span className="text-2xl font-semibold text-neutral-900">
                      {activeWord.original}
                    </span>
                    <span className="text-2xl text-neutral-500">
                      {activeWord.transcription}
                    </span>{" "}
                    <span className="text-lg text-neutral-900/85">
                      — {activeWord.partOfSpeech}, {activeWord.gender}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <section className="flex flex-col gap-1 border-t border-neutral-200 py-5">
                      <span className="text-neutral-500">Context</span>
                      <span className="font-medium text-neutral-900">
                        {activeWord.context}
                      </span>
                    </section>

                    <section className="flex flex-col gap-1 border-t border-neutral-200 py-5">
                      <span className="text-neutral-500">Example</span>
                      <div className="flex flex-col rounded-lg bg-neutral-50 p-2">
                        <span className="font-medium text-neutral-900">
                          {activeWord.example}
                        </span>
                        <span className="text-neutral-600">
                          {activeWord.exampleTranslation}
                        </span>
                      </div>
                    </section>
                  </div>

                  <div className="mt-auto pt-4 text-sm text-neutral-500">
                    {activeWordIndex + 1} of {wordset.set.length}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
