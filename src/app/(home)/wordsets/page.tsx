"use client";

import Link from "next/link";
import { WordSetsList } from "~/components/wordsets-list";
import { motion } from "motion/react";

export default function WordSetsPage() {
  return (
    <motion.main
      className="container mx-auto space-y-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-2xl font-bold">Your Word Sets</h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/new-set"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create New Set →
          </Link>
        </motion.div>
      </motion.div>
      <WordSetsList />
    </motion.main>
  );
}
