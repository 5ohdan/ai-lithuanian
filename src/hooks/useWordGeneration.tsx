"use client";

import { briefWordSetSchema, wordSetSchema } from "~/lib/schemas";
import { toast } from "sonner";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import type {
  CreateWordSet,
  BriefWordSet,
  WordSet,
  StoredBriefWordSet,
} from "~/lib/schemas";
import { getStorage } from "~/lib/storage";
import { useRouter } from "next/navigation";
import { useRef, useCallback } from "react";

const storage = getStorage();

type WordGenerationMode = "brief" | "enrich";
type WordGenerationOptions = {
  mode: WordGenerationMode;
  onSuccess?: (wordSetId: string) => void;
};

// Define return types for each mode
type BriefModeReturn = {
  handleSubmit: (data: CreateWordSet) => void;
  isLoading: boolean;
  partialWordSet: BriefWordSet | null;
};

type EnrichModeReturn = {
  handleSubmit: (briefWordSet: StoredBriefWordSet) => void;
  isLoading: boolean;
  partialWordSet: WordSet | null;
};

// Function overloads to provide proper typing based on mode
export function useWordGeneration(
  options?: { mode: "brief" } & Omit<WordGenerationOptions, "mode">,
): BriefModeReturn;
export function useWordGeneration(
  options: { mode: "enrich" } & Omit<WordGenerationOptions, "mode">,
): EnrichModeReturn;
export function useWordGeneration(
  options: WordGenerationOptions = { mode: "brief" },
): BriefModeReturn | EnrichModeReturn {
  const { mode, onSuccess } = options;
  const requestData = useRef<
    CreateWordSet | { id: string; words: BriefWordSet["words"] } | null
  >(null);
  const router = useRouter();

  // Choose the appropriate API endpoint and schema based on the mode
  const apiEndpoint =
    mode === "brief" ? "/api/words/brief" : "/api/words/enrich";
  const responseSchema = mode === "brief" ? briefWordSetSchema : wordSetSchema;

  const {
    submit,
    isLoading,
    object: partialWordSet,
  } = useObject({
    api: apiEndpoint,
    schema: responseSchema,
    onError: (error: Error) => {
      toast.error(
        `Failed to ${mode === "brief" ? "generate" : "enrich"} word set. Please try again. ${error.message}`,
      );
    },
    onFinish: ({ object }) => {
      toast.success(
        `Successfully ${mode === "brief" ? "generated" : "enriched"} a word set.`,
      );

      if (object) {
        let wordSetId: string;

        if (mode === "brief" && "topic" in requestData.current!) {
          // Handle brief word set
          const createWordSet = requestData.current;
          const { difficulty, topic } = createWordSet;
          wordSetId = storage.addBriefWordSet(object, difficulty, topic);
        } else if (mode === "enrich" && "id" in requestData.current!) {
          // Handle enriched word set - convert the brief word set to a full word set
          const briefSetId = (requestData.current as { id: string }).id;

          // Use the new method to convert the brief word set to a full word set
          wordSetId = storage.convertBriefToFullWordSet(
            briefSetId,
            object as WordSet,
          );
        } else {
          console.error("Invalid request data for the current mode");
          return;
        }

        // Allow custom success handler or default to navigation
        if (onSuccess) {
          onSuccess(wordSetId);
        } else {
          router.push(`/cards/${wordSetId}`);
        }
      }
    },
  });

  // Handle submission for brief word set generation
  const handleSubmitBrief = useCallback(
    (data: CreateWordSet) => {
      const { topic, difficulty, count } = data;
      requestData.current = data;
      submit({ topic, difficulty, count });
    },
    [submit],
  );

  // Handle submission for word set enrichment
  const handleSubmitEnrich = useCallback(
    (wordSet: StoredBriefWordSet) => {
      requestData.current = { id: wordSet.id, words: wordSet.set };

      // The API expects a BriefWordSet with 'words' and 'title'
      submit({
        words: wordSet.set,
        title: wordSet.title,
      });
    },
    [submit],
  );

  // Return typed handlers based on mode
  if (mode === "brief") {
    return {
      handleSubmit: handleSubmitBrief,
      isLoading,
      partialWordSet: partialWordSet as BriefWordSet | null,
    };
  } else {
    return {
      handleSubmit: handleSubmitEnrich,
      isLoading,
      partialWordSet: partialWordSet as WordSet | null,
    };
  }
}
