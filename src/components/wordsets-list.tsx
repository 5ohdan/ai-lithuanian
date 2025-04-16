"use client";

import { useEffect, useState, useRef } from "react";
import type { Storage } from "~/lib/schemas";
import { getStorage } from "~/lib/storage";
import { motion } from "motion/react";
import { LoadingScreen } from "./loading-screen";
import { WordSetsListItem } from "./wordsets-list-item";
import { NoSetsImg } from "./no-sets-img";
import Link from "next/link";
import { Button } from "./ui/button";
import { WordsetItemSkeleton } from "./wordset-item-skeleton";
const storage = getStorage();

export function WordSetsList() {
  const [wordsets, setWordsets] = useState<Storage["wordSets"]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [skeletonCount, setSkeletonCount] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedWordsets = storage.getWordSets();
    setWordsets(storedWordsets);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const calculateSkeletons = () => {
      if (!containerRef.current || !mainContainerRef.current) return;

      const mainContainerHeight = mainContainerRef.current.clientHeight;
      const wordsetItemsHeight = wordsets.length * 112;
      const dividerHeight = 20;
      const availableHeight =
        mainContainerHeight - wordsetItemsHeight - dividerHeight;

      if (availableHeight > 0) {
        const possibleSkeletons = Math.floor(availableHeight / 112);
        setSkeletonCount(Math.max(1, possibleSkeletons));
      } else {
        setSkeletonCount(1);
      }
    };

    calculateSkeletons();
    window.addEventListener("resize", calculateSkeletons);
    return () => window.removeEventListener("resize", calculateSkeletons);
  }, [wordsets.length]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!wordsets || wordsets.length === 0) {
    return (
      <div className="h-full w-full items-center justify-center px-10 pb-9 pt-28 xl:w-4/6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl bg-white px-8 py-6"
        >
          <NoSetsImg />
          <p className="flex flex-col items-center gap-4 pb-7 pt-11 text-neutral-900">
            <span className="text-2xl font-semibold">
              🚀 Your word sets will appear here!
            </span>
            <span className="text-center text-neutral-900">
              Start by generating a new word set based on any topic.
              <br />
              The more you create, the richer your vocabulary becomes!
            </span>
          </p>
          <Link href="/new-set">
            <Button className="h-12 bg-neutral-900 p-4 text-lg text-white">
              New wordset +
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex-col items-center justify-center px-10 pb-9 pt-28 xl:w-4/6">
      <div className="flex h-full w-full flex-col gap-4 rounded-2xl bg-white px-8 py-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold"
        >
          Your wordsets
        </motion.h1>
        <motion.div
          ref={mainContainerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex h-full w-full flex-col gap-4 overflow-y-scroll rounded-xl border border-neutral-300/50 p-6 shadow-md"
        >
          {wordsets.map((wordSet, index) => (
            <WordSetsListItem
              key={wordSet.id}
              wordSet={wordSet}
              index={index}
            />
          ))}
          <div className="flex w-full items-center gap-4 py-1">
            <hr className="flex-1 border-t border-neutral-300/50" />
            <span className="size-1 rounded-full bg-neutral-300" />
            <hr className="flex-1 border-t border-neutral-300/50" />
          </div>
          <div
            ref={containerRef}
            className="relative flex min-h-28 flex-1 flex-col gap-4 overflow-hidden"
          >
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <WordsetItemSkeleton key={index} />
            ))}
            <div className="absolute inset-0 flex min-h-28 flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_white_0%,_transparent_100%)]">
              <div className="flex flex-col items-center gap-5 rounded-xl bg-white/15 p-8 backdrop-blur-sm">
                {skeletonCount > 3 && (
                  <p className="text-lg font-medium text-gray-600">
                    The more you create, the richer your vocabulary becomes!
                  </p>
                )}
                <Link href="/new-set">
                  <Button className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-base text-white">
                    New wordset +
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
