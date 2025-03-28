"use client";

import { WordSetsList } from "~/components/wordsets-list";
import { motion } from "motion/react";

export default function WordSetsPage() {
  return (
    <div className="flex flex-col rounded-xl bg-white p-6">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-2xl font-bold">Your Word Sets</h1>
      </motion.div>
      <WordSetsList />
    </div>
  );
}
