"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import type { Storage } from "~/lib/schemas";
import { getStorage } from "~/lib/storage";
import { motion } from "motion/react";

const storage = getStorage();

export function WordSetsList() {
  const [wordsets, setWordsets] = useState<Storage["wordSets"]>();
  const router = useRouter();

  useEffect(() => {
    const storedWordsets = storage.getWordSets();
    setWordsets(storedWordsets);
  }, []);

  if (!wordsets || wordsets.length === 0) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-gray-500"
      >
        No word sets found. Generate some words to get started!
      </motion.p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid gap-4"
    >
      {wordsets.map((wordSet, index) => (
        <motion.div
          key={wordSet.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            className="cursor-pointer"
            onClick={() => router.push(`/wordsets/${wordSet.id}`)}
          >
            <CardContent className="p-4">
              <h2 className="mb-2 text-xl font-semibold">{wordSet.topic}</h2>
              <p className="mb-2 text-sm text-gray-500">
                Created: {new Date(wordSet.createdAt).toLocaleDateString()}
              </p>
              <div className="flex flex-wrap gap-2">
                {wordSet.set.map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.2 }}
                    className="rounded-md bg-gray-100 px-2 py-1 text-sm"
                  >
                    {word.original}
                  </motion.span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
