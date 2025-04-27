"use client";

import { Alexandria } from "next/font/google";
import { cn } from "~/lib/utils";
import { motion } from "motion/react";
import { useWordGeneration } from "~/hooks/useWordGeneration";
import { GenerationForm } from "./generation-form";

const alexandria = Alexandria({
  subsets: ["latin"],
  weight: ["600"],
});

export function PackGenerator() {
  const { handleSubmit, isLoading, partialPack } = useWordGeneration({
    mode: "brief",
  });

  return (
    <motion.div
      className="flex max-h-[500px] w-full max-w-[640px] flex-col items-center justify-between space-y-6 rounded-3xl bg-white px-16 pb-16 pt-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.5,
      }}
    >
      <h1 className={cn("text-4xl font-semibold", alexandria.className)}>
        Discover Lithuanian
      </h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 0.5,
        }}
        className="flex h-full w-full flex-col"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 0.5,
          }}
        >
          <GenerationForm
            isLoading={isLoading}
            submit={handleSubmit}
            length={partialPack?.words?.length}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
