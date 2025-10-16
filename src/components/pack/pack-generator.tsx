"use client";

import { cn } from "~/lib/utils";
import { motion, type Transition } from "motion/react";
import { useWordGeneration } from "~/hooks/use-word-generation";
import { GenerationForm } from "../generation-form";
import { alexandria } from "~/assets/fonts";

const springTransition: Transition = {
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
      className="mx-2 flex max-h-[500px] w-full max-w-[640px] flex-col items-center justify-between space-y-6 rounded-2xl bg-white px-4 pt-6 pb-8 shadow-md sm:mx-0 sm:rounded-3xl sm:px-16 sm:pt-12 sm:pb-16"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransition}
    >
      <h1
        className={cn(
          "text-2xl font-medium sm:text-3xl sm:font-bold",
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
