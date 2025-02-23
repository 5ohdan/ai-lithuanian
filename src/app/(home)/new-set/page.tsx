"use client";

import { useState } from "react";
import { experimental_useObject as useObject } from "ai/react";
import { toast } from "sonner";
import { type CreateWordSet, type WordSet, wordSetSchema } from "~/lib/schemas";
import { GenerationForm } from "~/components/generation-form";
import { CardStack } from "~/components/card-stack";
import { redirect } from "next/navigation";
import { getStorage } from "~/lib/storage";
import Link from "next/link";

const storage = getStorage();

export default function HomePage() {
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
    <main className="container mx-auto flex h-screen flex-col space-y-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Learn Words</h1>
        <Link
          href="/wordsets"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          View Word Sets
        </Link>
      </div>
      <GenerationForm isLoading={isLoading} submit={handleSubmit} />
      {words.length > 0 && <CardStack words={words} />}
    </main>
  );
}
