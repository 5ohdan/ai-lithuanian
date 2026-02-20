"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { StoredPack, Word } from "~/lib/schemas";
import { getStorage } from "~/lib/storage";
import Link from "next/link";
import { LoadingScreen } from "../loading-screen";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { PackViewSidebar } from "./pack-view-sidebar";
import { cn } from "~/lib/utils";
import { useIsMobile } from "~/hooks/use-mobile";
import { merriweather, voces } from "~/assets/fonts";

const storage = getStorage();

type PackViewProps = {
  packId: string;
};

export default function PackView(props: PackViewProps) {
  const { packId } = props;

  const [pack, setPack] = useState<StoredPack | undefined>(undefined);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

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
    setActiveWordIndex((prev) => (prev === 0 ? pack.words.length - 1 : prev - 1));
  }, [pack]);

  const handleNext = useCallback(() => {
    if (!pack) return;
    setActiveWordIndex((prev) => (prev === pack.words.length - 1 ? 0 : prev + 1));
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
      <div className="flex min-h-svh items-center justify-center">
        <div className="flex flex-col items-center justify-center rounded-lg bg-white/75 p-4 text-center text-neutral-900 shadow-xs">
          <h2 className="mb-2 text-xl font-bold text-neutral-900">Pack Not Found</h2>
          <p className="mb-4 text-neutral-900">
            The pack you&apos;re looking for doesn&apos;t exist or may have been deleted.
          </p>
          <Link
            href="/packs"
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-fit items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Packs
          </Link>
        </div>
      </div>
    );
  }

  const activeWord = pack.words[activeWordIndex];

  if (!activeWord) {
    return <div>Word not found</div>;
  }

  return (
    <SidebarProvider
      defaultOpen={!isMobile}
      className="h-full max-h-svh min-h-0 w-full overflow-y-auto"
    >
      <div className="flex w-full items-center justify-center p-2 pt-16 sm:px-6 sm:pt-20 sm:pb-6">
        <div className="flex h-full w-full flex-col rounded-xl bg-white p-2 sm:max-h-[75vh] sm:max-w-[1024px] sm:rounded-2xl">
          <div className="relative mb-3 flex items-center justify-center">
            <div className="absolute left-1">
              <SidebarTrigger className={cn("transition-all duration-200 ease-in-out")} />
            </div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 20,
                mass: 0.6,
              }}
              className="mx-auto w-fit justify-self-center rounded-lg bg-neutral-900 px-4 py-1 text-center text-base text-white sm:text-2xl"
            >
              {pack.title}
            </motion.h1>
          </div>
          <div className="relative h-full w-full overflow-hidden rounded-xl p-3">
            <div className="flex h-full">
              <PackViewSidebar
                words={pack.words}
                activeWordIndex={activeWordIndex}
                setActiveWordIndex={setActiveWordIndex}
                isMobile={isMobile}
              />
              <MainContent
                activeWord={activeWord}
                activeWordIndex={activeWordIndex}
                packLength={pack.words.length}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

function MainContent({
  activeWord,
  activeWordIndex,
  packLength,
}: {
  activeWord: Word;
  activeWordIndex: number;
  packLength: number;
}) {
  return (
    <div className="w-full">
      <div className="relative flex h-full flex-col overflow-y-auto bg-white transition-all duration-300 sm:rounded-xl sm:border sm:border-neutral-200 sm:p-5 sm:shadow-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeWord.original}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
              mass: 0.3,
              duration: 0.15,
            }}
            className="flex flex-1 flex-col"
          >
            <div className="flex flex-wrap items-center gap-x-2 pb-5">
              <span className="text-2xl font-bold text-neutral-900">{activeWord.original}</span>
              <div className="flex items-center gap-2">
                <span className={`text-2xl tracking-wide text-neutral-500 ${voces.className}`}>
                  {activeWord.transcription}
                </span>
                <span className="text-lg text-neutral-900/85">
                  — {activeWord.partOfSpeech}, {activeWord.gender}
                </span>
              </div>
              <span
                className={`w-full text-xl font-light text-neutral-700 italic ${merriweather.className}`}
              >
                {activeWord.translation}
              </span>
            </div>

            <div className="flex flex-col">
              <section className="flex flex-col gap-1 border-t border-neutral-200 py-5">
                <span className="text-neutral-500">Meanings of the word</span>
                <ol className="list-inside list-decimal space-y-2">
                  {activeWord.meanings.map((meaning, index) => (
                    <li className="text-neutral-900" key={index}>
                      <span className="font-medium">{meaning.context}</span>
                      {" — "}
                      <span className="text-neutral-600">{meaning.translation}</span>
                      <div className="mt-1 flex flex-col rounded-lg bg-neutral-50 p-3">
                        <div className="font-medium">{meaning.example}</div>
                        <div className="text-neutral-500">{meaning.exampleTranslation}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <div className="mt-auto pt-4 text-sm text-neutral-500">
              {activeWordIndex + 1} of {packLength}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
