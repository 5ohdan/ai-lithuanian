"use client";

import { useState } from "react";
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
  const [currentTopic, setCurrentTopic] = useState("");
  const [currentDifficulty, setCurrentDifficulty] = useState("Beginner");

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
      storage.addWordSet(object!, currentTopic, currentDifficulty);
      setWords(object ?? []);
    },
  });

  const handleSubmit = (data: CreateWordSet) => {
    const { topic, difficulty, count } = data;
    setCurrentTopic(topic);
    setCurrentDifficulty(difficulty);
    submit({ topic, difficulty, count });
  };

  return (
    <>
      <GenerationForm isLoading={isLoading} submit={handleSubmit} />
      {words.length > 0 && <CardStack words={words} />}
    </>
  );
}
