"use client";

import Link from "next/link";
import { WordSetGenerator } from "~/components/wordset-generator";
import { motion } from "motion/react";

export default function HomePage() {
  return (
    <motion.main
      className="container mx-auto flex h-screen flex-col space-y-4 overflow-hidden py-8"
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
        <h1 className="text-2xl font-semibold">Learn Words</h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/wordsets"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            View Word Sets →
          </Link>
        </motion.div>
      </motion.div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <WordSetGenerator />
      </div>
    </motion.main>
  );
}
