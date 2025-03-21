"use client";

import { WordSetGenerator } from "~/components/wordset-generator";
import { motion } from "motion/react";

export default function HomePage() {
  return (
    <motion.div
      className="container mx-auto flex h-full items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex max-h-[500px] w-full max-w-[640px] flex-col items-center justify-between space-y-6 rounded-3xl bg-white px-16 pb-16 pt-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-4xl font-semibold">Generate new wordset</h1>
        <WordSetGenerator />
      </motion.div>
    </motion.div>
  );
}
