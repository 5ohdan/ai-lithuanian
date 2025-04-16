"use client";

import { motion } from "motion/react";
import { useWordGeneration } from "~/hooks/useWordGeneration";
import { GenerationForm } from "./generation-form";

export function WordSetGenerator() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { handleSubmit, isLoading, partialWordSet } = useWordGeneration();

  console.log(partialWordSet?.length);

  return (
    <motion.div
      className="flex max-h-[500px] w-full max-w-[640px] flex-col items-center justify-between space-y-6 rounded-3xl bg-white px-16 pb-16 pt-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h1 className="text-4xl font-semibold">Generate new wordset</h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex h-full w-full flex-col"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          <GenerationForm
            isLoading={isLoading}
            submit={handleSubmit}
            length={partialWordSet?.length}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
