"use client";

import { wordSetSchema } from "~/lib/schemas";
import { toast } from "sonner";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import type { CreateWordSet } from "~/lib/schemas";
import { getStorage } from "~/lib/storage";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export function useWordGeneration() {
  const storage = getStorage();
  const requestData = useRef<CreateWordSet | null>(null);
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const {
    submit,
    isLoading,
    object: partialWordSet,
  } = useObject({
    api: "/api/generate-word-set",
    schema: wordSetSchema,
    onError: (error: Error) => {
      toast.error(
        "Failed to generate word set. Please try again. " + error.message,
      );
    },
    onFinish: ({ object }) => {
      toast.success("Successfully generated a word set.");
      const { topic, difficulty } = requestData.current!;
      if (object) {
        const wordSetId = storage.addWordSet(object, topic, difficulty);
        router.push(`/cards/${wordSetId}`);
      }
    },
  });

  const handleSubmit = (data: CreateWordSet) => {
    const { topic, difficulty, count } = data;
    requestData.current = data;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    submit({ topic, difficulty, count });
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return { handleSubmit, isLoading, partialWordSet };
}
