"use client";

import { useState } from "react";
import { experimental_useObject as useObject } from "ai/react";
import { toast } from "sonner";
import { wordSetSchema } from "~/lib/schemas";
import type { z } from "zod";
import { GenerationForm } from "~/components/generation-form";
import { CardStack } from "~/components/card-stack";
import { redirect } from "next/navigation";

export default function HomePage() {
  const [words, setWords] = useState<z.infer<typeof wordSetSchema>>([]);
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
      setWords(object ?? []);
    },
  });

  return (
    <main className="flex flex-col gap-3 p-4">
      <h1 className="text-2xl font-semibold">Learn Words</h1>
      <GenerationForm isLoading={isLoading} submit={submit} />
      {words.length > 0 && <CardStack words={words} />}
    </main>
  );
}
