"use client";

import { useState } from "react";
import { experimental_useObject as useObject } from "ai/react";
import { toast } from "sonner";
import { wordSetSchema } from "~/lib/schemas";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  const [aiResponse, setAiResponse] = useState<z.infer<typeof wordSetSchema>>(
    [],
  );
  const { submit, object, isLoading } = useObject({
    api: "/api/generate-word-set",
    schema: wordSetSchema,
    initialValue: undefined,
    onError: (error) => {
      toast.error("Failed to generate quiz. Please try again.");
    },
    onFinish: ({ object }) => {
      setAiResponse(object ?? []);
    },
  });

  return (
    <>
      <h1>Hello words:</h1>
      <form>
        <Input />
        <Button onClick={async () => submit("")}>Generate a word set</Button>
      </form>
      {aiResponse.map((word) => (
        <div
          className="flex flex-col rounded-md border border-neutral-700/50 p-2"
          key={word.original}
        >
          <h2 className="text-underline text-2xl font-medium">
            {word.original}
          </h2>
          <p>{word.translation}</p>
          <p>{word.transcription}</p>
          <p>{word.context}</p>
          <p>{word.example}</p>
        </div>
      ))}
    </>
  );
}
