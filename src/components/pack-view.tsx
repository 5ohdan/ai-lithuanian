"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { StoredPack } from "~/lib/schemas";
import { getStorage } from "~/lib/storage";
import Link from "next/link";
import { LoadingScreen } from "./loading-screen";

const storage = getStorage();

export default function PackView({ packId }: { packId: string }) {
  const [pack, setPack] = useState<StoredPack | undefined>(undefined);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPack = async () => {
      setIsLoading(true);
      try {
        const fetchedPack = storage.getPackById(packId);
        setPack(fetchedPack);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPack();
  }, [packId]);

  const handlePrevious = useCallback(() => {
    if (!pack) return;
    setActiveWordIndex((prev) => (prev === 0 ? pack.set.length - 1 : prev - 1));
  }, [pack]);

  const handleNext = useCallback(() => {
    if (!pack) return;
    setActiveWordIndex((prev) => (prev === pack.set.length - 1 ? 0 : prev + 1));
  }, [pack]);

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

  if (!pack) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center justify-center rounded-lg bg-white/75 p-4 text-center text-neutral-900 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-neutral-900">
            Pack Not Found
          </h2>
          <p className="mb-4 text-neutral-900">
            The pack you&apos;re looking for doesn&apos;t exist or may have been
            deleted.
          </p>
          <Link
            href="/packs"
            className="flex w-fit items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Packs
          </Link>
        </div>
      </div>
    );
  }

  const activeWord = pack.set[activeWordIndex];

  if (!activeWord) {
    return <div>Word not found</div>;
  }

  return (
    <div className="flex h-full w-full items-center justify-center px-10 pb-9 pt-28">
      <div className="flex h-full w-full max-w-[1024px] flex-col rounded-xl bg-white">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 0.5,
          }}
          className="mx-auto mt-[-1px] w-fit rounded-b-md bg-neutral-900 px-5 py-2 text-center text-2xl font-semibold text-white"
        >
          {pack.title}
        </motion.h1>
        <div className="flex-1 overflow-hidden px-10 py-6">
          <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-[300px,1fr]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                mass: 0.5,
              }}
              className="max-h-full overflow-y-auto rounded-xl border border-neutral-200 bg-white p-4 shadow-md"
            >
              <div className="flex flex-col gap-4">
                {pack.set.map((word, index) => (
                  <motion.div
                    key={word.original}
                    whileHover={{
                      scale: 1.01,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        mass: 0.5,
                      },
                    }}
                    whileTap={{
                      scale: 0.99,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        mass: 0.5,
                      },
                    }}
                    onClick={() => setActiveWordIndex(index)}
                    className={`cursor-pointer rounded-lg p-3 transition-colors ${
                      index === activeWordIndex
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100/80 hover:bg-neutral-200/80"
                    }`}
                  >
                    <p className="flex items-center gap-2">
                      <span
                        className={`flex h-5 w-7 shrink-0 items-center justify-center rounded-sm border bg-neutral-900 text-xs text-white ${index === activeWordIndex ? "border-white" : "border-transparent"}`}
                      >
                        lt
                      </span>
                      <span
                        className={`truncate text-xl font-medium ${
                          index === activeWordIndex
                            ? "text-white"
                            : "text-neutral-900"
                        }`}
                      >
                        {word.original}
                      </span>
                    </p>
                    <p
                      className={`truncate text-sm ${index === activeWordIndex ? "text-white" : "text-neutral-900"}`}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  mass: 0.3,
                  opacity: { duration: 0.15 },
                }}
                className="flex h-full flex-col overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-md transition-all duration-300"
              >
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap gap-x-2 pb-5">
                    <span className="text-2xl font-semibold text-neutral-900">
                      {activeWord.original}
                    </span>
                    <div className="flex items-center gap-2">
                      {activeWord.transcription && (
                        <span className="text-2xl text-neutral-500">
                          {activeWord.transcription}
                        </span>
                      )}
                      <span className="text-lg text-neutral-900/85">
                        — {activeWord.partOfSpeech}, {activeWord.gender}
                      </span>
                    </div>
                    <span className="w-full text-xl italic text-neutral-700">
                      {activeWord.translation}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <section className="flex flex-col gap-1 border-t border-neutral-200 py-5">
                      <span className="text-neutral-500">
                        Meanings of the word
                      </span>
                      <ol className="list-inside list-decimal space-y-2">
                        {activeWord.meanings.map((meaning, index) => (
                          <li className="text-neutral-900" key={index}>
                            <span className="font-medium">
                              {meaning.context}
                            </span>
                            {" — "}
                            <span className="text-neutral-600">
                              {meaning.translation}
                            </span>
                            <div className="mt-1 flex flex-col rounded-lg bg-neutral-50 p-3">
                              <div className="font-medium">
                                {meaning.example}
                              </div>
                              <div className="text-neutral-500">
                                {meaning.exampleTranslation}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </section>
                  </div>

                  <div className="mt-auto pt-4 text-sm text-neutral-500">
                    {activeWordIndex + 1} of {pack.set.length}
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
