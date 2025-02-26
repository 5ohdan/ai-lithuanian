"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, List, Plus, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { StoredWordSet } from "~/lib/schemas";
import { getStorage } from "~/lib/storage";
import Link from "next/link";

const storage = getStorage();

export default function WordsetView({ wordsetId }: { wordsetId: string }) {
  const [wordset, setWordset] = useState<StoredWordSet | undefined>(undefined);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWordset = async () => {
      setIsLoading(true);
      const fetchedWordset = storage.getWordSetById(wordsetId);
      setWordset(fetchedWordset);
      setIsLoading(false);
    };

    void fetchWordset();
  }, [wordsetId]);

  // Define navigation functions with useCallback
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

  // Add keyboard navigation using up and down arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        handlePrevious();
      } else if (e.key === "ArrowDown") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePrevious, handleNext]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-zinc-900"></div>
          <p className="text-zinc-600">Loading wordset...</p>
        </div>
      </div>
    );
  }

  if (!wordset) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-zinc-50 p-8 text-center shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-zinc-900">
            Wordset Not Found
          </h2>
          <p className="mb-4 text-zinc-600">
            The wordset you&apos;re looking for doesn&apos;t exist or may have
            been deleted.
          </p>
          <Link
            href="/wordsets"
            className="inline-flex items-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
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
    <main className="min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-3xl grid-rows-[auto,1fr] p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              {wordset.topic}
            </h1>
          </div>

          <div className="flex gap-4">
            <Link
              href="/wordsets"
              className="group flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to List
            </Link>
            <Link
              href="/new-set"
              className="group flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Wordset
            </Link>
          </div>
        </motion.div>

        <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-[250px,1fr]">
          {/* Word List Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-fit overflow-auto rounded-xl border border-zinc-200 bg-white p-4 md:h-full"
          >
            <h2 className="mb-3 flex items-center text-lg font-semibold">
              <List className="mr-2 h-4 w-4" />
              Words
            </h2>
            <div className="space-y-2">
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

          {/* Word Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeWord.original}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative flex h-full flex-col rounded-xl border border-zinc-200 bg-white transition-all duration-300 hover:shadow-lg"
              onMouseEnter={() => setIsCardHovered(true)}
              onMouseLeave={() => setIsCardHovered(false)}
            >
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <motion.h2
                    layout
                    className="group flex cursor-pointer items-center text-2xl font-semibold tracking-tight text-zinc-900 hover:text-zinc-600"
                  >
                    {activeWord.original}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="ml-2 p-1 opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
                    >
                      <Volume2 className="h-5 w-5 text-zinc-500" />
                    </motion.button>
                  </motion.h2>

                  <div className="text-sm text-zinc-500">
                    {activeWordIndex + 1} of {wordset.set.length}
                  </div>
                </div>

                <motion.div
                  layout
                  className="mx-auto mt-6 flex w-full max-w-xl flex-1 flex-col justify-center space-y-6"
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

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isCardHovered ? 1 : 0 }}
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-zinc-500/5 to-transparent"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
