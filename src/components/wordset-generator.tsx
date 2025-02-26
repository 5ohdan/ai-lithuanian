"use client";

import { useRef, useState } from "react";
import { experimental_useObject as useObject } from "ai/react";
import { toast } from "sonner";
import { type CreateWordSet, type WordSet, wordSetSchema } from "~/lib/schemas";
import { GenerationForm } from "~/components/generation-form";
import { CardStack } from "~/components/card-stack";
import { redirect } from "next/navigation";
import { getStorage } from "~/lib/storage";
import { motion, AnimatePresence } from "motion/react";

const storage = getStorage();

export function WordSetGenerator() {
  const [words, setWords] = useState<WordSet>([]);
  const requestData = useRef<CreateWordSet | null>(null);

  const { submit, isLoading } = useObject({
    api: "/api/generate-word-set",
    schema: wordSetSchema,
    initialValue: [],
    onError: (error) => {
      toast.error(
        "Failed to generate quiz. Please try again. " + error.message,
      );
      if (
        error.message === "Token is NOT valid" ||
        error.message === "Unauthorized"
      ) {
        redirect("/key-form");
      }
    },
    onFinish: ({ object }) => {
      toast.success("Successfully generated a word set.");
      const { topic, difficulty } = requestData.current ?? {}; // i know it will not be null
      if (topic && difficulty) {
        storage.addWordSet(object!, topic, difficulty);
      }
      setWords(object ?? []);
    },
  });

  const handleSubmit = (data: CreateWordSet) => {
    const { topic, difficulty, count } = data;
    requestData.current = data;
    submit({ topic, difficulty, count });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-full flex-col"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GenerationForm isLoading={isLoading} submit={handleSubmit} />
      </motion.div>

      <AnimatePresence>
        {words.length > 0 && (
          <motion.div
            key="card-stack"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="min-h-0 flex-1 overflow-hidden pt-4"
          >
            <CardStack words={words} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
