"use client";

import { useRef, useState } from "react";
import { experimental_useObject as useObject } from "ai/react";
import { toast } from "sonner";
import { type CreateWordSet, type WordSet, wordSetSchema } from "~/lib/schemas";
import { GenerationForm } from "~/components/generation-form";
import { CardStack } from "~/components/card-stack";
import { redirect } from "next/navigation";
import { getStorage } from "~/lib/storage";

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
    <>
      <GenerationForm isLoading={isLoading} submit={handleSubmit} />
      {words.length > 0 && <CardStack words={words} />}
    </>
  );
}
