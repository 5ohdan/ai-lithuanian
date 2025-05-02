"use client";

import { useEffect, useState, useRef } from "react";
import type { Storage } from "~/lib/schemas";
import { getStorage } from "~/lib/storage";
import { motion } from "motion/react";
import { LoadingScreen } from "./loading-screen";
import { PacksListItem } from "./packs-list-item";
import { NoPacksImg } from "./no-packs-img";
import Link from "next/link";
import { Button } from "./ui/button";
import { PackItemSkeleton } from "./pack-item-skeleton";
import { Trash } from "lucide-react";
import { ConfirmationDialog } from "./confirmation-dialog";
import { useIsMobile } from "../hooks/use-mobile";

const storage = getStorage();

export function PacksList() {
  const [packs, setPacks] = useState<
    (Storage["packs"][number] | Storage["briefPacks"][number])[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [skeletonCount, setSkeletonCount] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const updatePacks = () => {
      const storedPacks = storage.getPacks();
      const storedBriefPacks = storage.getBriefPacks();
      setPacks([...storedPacks, ...storedBriefPacks]);
      setIsLoading(false);
    };

    updatePacks();

    const unsubscribe = storage.subscribe(updatePacks);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const calculateSkeletons = () => {
      if (!containerRef.current || !mainContainerRef.current) return;

      const deviceIsMobile = !!isMobile;
      const mainContainerHeight = mainContainerRef.current.clientHeight;

      // Use significantly smaller height for mobile skeletons to fit more
      const packItemHeight = deviceIsMobile ? 48 : 96; // Much smaller on mobile
      const dividerHeight = deviceIsMobile ? 8 : 12;
      const packItemsHeight = packs.length * packItemHeight;

      const availableHeight =
        mainContainerHeight - packItemsHeight - dividerHeight;

      if (availableHeight > 0) {
        const possibleSkeletons = Math.floor(availableHeight / packItemHeight);
        // No max limit, allow as many as can fit
        setSkeletonCount(Math.max(1, possibleSkeletons));
      } else {
        setSkeletonCount(1);
      }
    };

    calculateSkeletons();
    window.addEventListener("resize", calculateSkeletons);
    return () => window.removeEventListener("resize", calculateSkeletons);
  }, [packs.length, isMobile]);

  // const handleDeleteAll = () => {
  //   setIsDeleteDialogOpen(true);
  // };

  const confirmDeleteAll = () => {
    storage.deleteAllPacks();
    setPacks([]);
    setIsDeleteDialogOpen(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!packs || packs.length === 0) {
    return (
      <div className="flex h-svh w-full items-center justify-center px-2 pb-10 pt-16 sm:h-full sm:px-10 sm:pb-9 sm:pt-28 xl:w-4/6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 0.5,
          }}
          className="flex h-full w-full flex-col items-center justify-between gap-4 overflow-auto rounded-2xl bg-white px-8 py-6"
        >
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <div className="flex-shrink-1 w-full max-w-[300px]">
              <NoPacksImg className="h-auto max-h-[300px] w-full object-contain" />
            </div>
            <p className="flex flex-col items-center gap-4 text-neutral-900">
              <span className="text-2xl font-semibold">
                Your wordsets will appear here!
              </span>
              <span className="text-center text-neutral-900">
                Pick a topic and{" "}
                <Link
                  href="/new-pack"
                  className="italic underline transition-all hover:rounded-sm hover:bg-neutral-100 hover:p-2 hover:no-underline"
                >
                  make
                </Link>{" "}
                your first wordset.
                <br />
                Your vocabulary grows with each one!
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full w-full items-center justify-center px-2 pb-2 pt-16 sm:px-10 sm:pb-9 sm:pt-28 xl:w-4/6">
      <div className="flex h-full w-full flex-col gap-2 rounded-2xl bg-white px-4 py-4 sm:gap-4 sm:px-8 sm:py-6">
        <div className="flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              mass: 0.5,
            }}
            className="text-xl font-semibold sm:text-3xl sm:font-bold"
          >
            Your wordsets
          </motion.h1>
          {/* <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              mass: 0.5,
            }}
          >
            <Button
              title="Delete all packs"
              onClick={handleDeleteAll}
              variant="ghost"
              size="icon"
              className="border shadow-xs"
            >
              <Trash />
            </Button>
          </motion.span> */}
        </div>
        <motion.div
          ref={mainContainerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 0.5,
          }}
          className="relative flex h-full w-full flex-col overflow-y-scroll sm:gap-4 sm:rounded-xl sm:border sm:border-neutral-300/50 sm:p-6 sm:shadow-md"
        >
          <div className="flex flex-col gap-2 sm:gap-4">
            {packs.map((pack, index) => (
              <PacksListItem key={pack.id} pack={pack} index={index} />
            ))}
          </div>
          <div className="flex w-full items-center gap-4 py-2 sm:py-1">
            <hr className="flex-1 border-t border-neutral-300/50" />
            <span className="size-1 rounded-full bg-neutral-300" />
            <hr className="flex-1 border-t border-neutral-300/50" />
          </div>
          <div
            ref={containerRef}
            className="relative flex min-h-20 flex-1 flex-col gap-2 overflow-hidden sm:min-h-28 sm:gap-4"
          >
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <PackItemSkeleton key={index} />
            ))}
            <div className="absolute inset-0 flex min-h-20 flex-col items-center justify-center bg-[radial-gradient(circle_at_center,white_0%,transparent_100%)] sm:min-h-28">
              <div className="flex flex-col items-center gap-3 rounded-xl bg-white/15 p-4 backdrop-blur-xs sm:gap-5 sm:p-8">
                <p className="text-wrap text-center text-sm font-medium text-gray-600 sm:text-lg">
                  The more you{" "}
                  <Link
                    href="/new-pack"
                    className="italic underline transition-all hover:rounded-sm hover:bg-neutral-100 hover:p-2 hover:no-underline"
                  >
                    create
                  </Link>
                  , the richer your vocabulary becomes!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteAll}
        title="Delete All Packs"
        description="Are you sure you want to delete all your packs? This action cannot be undone."
        confirmText="Delete All"
        cancelText="Cancel"
      />
    </div>
  );
}
