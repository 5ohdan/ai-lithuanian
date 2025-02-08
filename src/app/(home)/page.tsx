"use client";

import { useState } from "react";
import { experimental_useObject as useObject } from "ai/react";
import { toast } from "sonner";
import { wordSetSchema } from "~/lib/schemas";
import type { z } from "zod";
// import { Word } from "~/components/word";
import { GenerationForm } from "~/components/generation-form";
import { CardStack } from "~/components/card-stack";

export default function HomePage() {
  const [words, setWords] = useState<z.infer<typeof wordSetSchema>>([]);
  const {
    submit,
    object: partialCards,
    isLoading,
  } = useObject({
    api: "/api/generate-word-set",
    schema: wordSetSchema,
    initialValue: undefined,
    onError: (error) => {
      toast.error("Failed to generate quiz. Please try again." + error.message);
    },
    onFinish: ({ object }) => {
      toast.success("Successfully generated a word set.");
      setWords(object ?? []);
    },
  });

  return (
    <main className="flex flex-col gap-3 p-4">
      <h1 className="text-2xl font-semibold">Learn Words</h1>
      <GenerationForm isLoading={isLoading} submit={submit} />
      {words.length > 0 && (
        <div className="grid">
          <CardStack words={words} />
          {/* {words.map((word) => (
          <Word key={word.original} {...word} />
        ))} */}
        </div>
      )}
    </main>
  );
}
