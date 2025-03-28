"use client";

import { useRef } from "react";
import { experimental_useObject as useObject } from "ai/react";
import { toast } from "sonner";
import { type CreateWordSet, wordSetSchema } from "~/lib/schemas";
import { GenerationForm } from "~/components/generation-form";
import { useRouter } from "next/navigation";
import { getStorage } from "~/lib/storage";
import { motion } from "motion/react";
import type { ValidationErrorResponse } from "~/utils/auth";
const storage = getStorage();

export function WordSetGenerator() {
  const requestData = useRef<CreateWordSet | null>(null);

  const router = useRouter();

  const { submit, isLoading } = useObject({
    api: "/api/generate-word-set",
    schema: wordSetSchema,
    initialValue: [],
    onError: (error) => {
      console.log("error", error);
      try {
        const errorData = JSON.parse(error.message) as ValidationErrorResponse;
        if (errorData.keyRemoved) {
          toast.error("Your API key was removed because it's invalid", {
            description: errorData.message,
            action: {
              label: "Add New Key",
              onClick: () => router.push("/key-form"),
            },
          });
        } else {
          toast.error(
            "Failed to generate quiz. Please try again. " +
              (errorData.message ?? error.message),
          );
        }
      } catch {
        toast.error(
          "Failed to generate quiz. Please try again. " + error.message,
        );
      }

      if (
        error.message.includes("Token is NOT valid") ||
        error.message.includes("Unauthorized")
      ) {
        router.push("/key-form");
      }
    },
    onFinish: ({ object }) => {
      toast.success("Successfully generated a word set.");
      const { topic, difficulty } = requestData.current ?? {}; // i know it will not be null
      if (topic && difficulty) {
        const wordSetId = storage.addWordSet(object!, topic, difficulty);
        console.log("wordSetId", wordSetId);
        router.push(`/cards/${wordSetId}`);
      }
    },
  });

  const handleSubmit = (data: CreateWordSet) => {
    const { topic, difficulty, count } = data;
    requestData.current = data;
    submit({ topic, difficulty, count });
  };

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
          <GenerationForm isLoading={isLoading} submit={handleSubmit} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
