"use client";

import { Alexandria } from "next/font/google";
import { cn } from "~/lib/utils";
import { motion } from "motion/react";
import { useWordGeneration } from "~/hooks/use-word-generation";
import { GenerationForm } from "./generation-form";

const alexandria = Alexandria({
  subsets: ["latin"],
  weight: ["500"],
});

const springTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 0.5,
};

export function PackGenerator() {
  const { handleSubmit, isLoading, partialPack } = useWordGeneration({
    mode: "brief",
  });

  return (
    <motion.div
      className="mx-2 flex max-h-[500px] w-full max-w-[640px] flex-col items-center justify-between space-y-6 rounded-2xl bg-white px-4 pb-8 pt-6 sm:mx-0 sm:rounded-3xl sm:px-16 sm:pb-16 sm:pt-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransition}
    >
      <h1
        className={cn(
          "text-2xl font-medium sm:text-3xl sm:font-semibold",
          alexandria.className,
        )}
      >
        Discover Lithuanian Words
      </h1>

      <div className="h-full w-full">
        <GenerationForm
          isLoading={isLoading}
          submit={handleSubmit}
          length={partialPack?.words?.length}
        />
      </div>
    </motion.div>
  );
}
