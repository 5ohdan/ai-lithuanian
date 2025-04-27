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

  useEffect(() => {
    const updatePacks = () => {
      const storedPacks = storage.getPacks();
      const storedBriefPacks = storage.getBriefPacks();
      setPacks([...storedPacks, ...storedBriefPacks]);
      setIsLoading(false);
    };

    // Initial load
    updatePacks();

    // Subscribe to storage changes
    const unsubscribe = storage.subscribe(updatePacks);

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const calculateSkeletons = () => {
      if (!containerRef.current || !mainContainerRef.current) return;

      const mainContainerHeight = mainContainerRef.current.clientHeight;
      const packItemsHeight = packs.length * 112;
      const dividerHeight = 20;
      const availableHeight =
        mainContainerHeight - packItemsHeight - dividerHeight;

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
  }, [packs.length]);

  const handleDeleteAll = () => {
    setIsDeleteDialogOpen(true);
  };

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
      <div className="flex h-full w-full items-center justify-center px-10 pb-9 pt-28 xl:w-4/6">
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
                Your packs will appear here!
              </span>
              <span className="text-center text-neutral-900">
                Pick a topic and{" "}
                <Link
                  href="/new-pack"
                  className="italic underline transition-all hover:rounded-sm hover:bg-neutral-100 hover:p-2 hover:no-underline"
                >
                  make
                </Link>{" "}
                your first pack.
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
    <div className="h-full w-full flex-col items-center justify-center px-10 pb-9 pt-28 xl:w-4/6">
      <div className="flex h-full w-full flex-col gap-4 rounded-2xl bg-white px-8 py-6">
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
            className="text-3xl font-bold"
          >
            Your packs
          </motion.h1>
          <motion.span
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
              className="border shadow-sm"
            >
              <Trash />
            </Button>
          </motion.span>
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
          className="relative flex h-full w-full flex-col gap-4 overflow-y-scroll rounded-xl border border-neutral-300/50 p-6 shadow-md"
        >
          {packs.map((pack, index) => (
            <PacksListItem key={pack.id} pack={pack} index={index} />
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
              <PackItemSkeleton key={index} />
            ))}
            <div className="absolute inset-0 flex min-h-28 flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_white_0%,_transparent_100%)]">
              <div className="flex flex-col items-center gap-5 rounded-xl bg-white/15 p-8 backdrop-blur-sm">
                <p className="text-lg font-medium text-gray-600">
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
