"use client";

import { briefPackSchema, packSchema } from "~/lib/schemas";
import { toast } from "sonner";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import type {
  CreatePack,
  BriefPack,
  Pack,
  StoredBriefPack,
} from "~/lib/schemas";
import { getStorage } from "~/lib/storage";
import { useRouter } from "next/navigation";
import { useRef, useCallback } from "react";

const storage = getStorage();

type WordGenerationMode = "brief" | "enrich";
type WordGenerationOptions = {
  mode: WordGenerationMode;
  onSuccess?: (packId: string) => void;
};

// Define return types for each mode
type BriefModeReturn = {
  handleSubmit: (data: CreatePack) => void;
  isLoading: boolean;
  partialPack: BriefPack | null;
};

type EnrichModeReturn = {
  handleSubmit: (briefPack: StoredBriefPack) => void;
  isLoading: boolean;
  partialPack: Pack | null;
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
    CreatePack | { id: string; words: BriefPack["words"] } | null
  >(null);
  const router = useRouter();

  // Choose the appropriate API endpoint and schema based on the mode
  const apiEndpoint =
    mode === "brief" ? "/api/words/brief" : "/api/words/enrich";
  const responseSchema = mode === "brief" ? briefPackSchema : packSchema;

  const {
    submit,
    isLoading,
    object: partialPack,
  } = useObject({
    api: apiEndpoint,
    schema: responseSchema,
    onError: (error: Error) => {
      toast.error(
        `Failed to ${mode === "brief" ? "generate" : "enrich"} pack. Please try again. ${error.message}`,
      );
    },
    onFinish: ({ object }) => {
      toast.success(
        `Successfully ${mode === "brief" ? "generated" : "enriched"} a pack.`,
      );

      if (object) {
        let packId: string;

        if (mode === "brief" && "topic" in requestData.current!) {
          // Handle brief pack
          const createPack = requestData.current;
          const { difficulty, topic } = createPack;
          packId = storage.addBriefPack(object, difficulty, topic);
        } else if (mode === "enrich" && "id" in requestData.current!) {
          // Handle enriched pack - convert the brief pack to a full pack
          const briefSetId = (requestData.current as { id: string }).id;

          // Use the new method to convert the brief pack to a full pack
          packId = storage.convertBriefToFullPack(briefSetId, object as Pack);
        } else {
          console.error("Invalid request data for the current mode");
          return;
        }

        // Allow custom success handler or default to navigation
        if (onSuccess) {
          onSuccess(packId);
        } else {
          router.push(`/cards/${packId}`);
        }
      }
    },
  });

  // Handle submission for brief pack generation
  const handleSubmitBrief = useCallback(
    (data: CreatePack) => {
      const { topic, difficulty, count } = data;
      requestData.current = data;
      submit({ topic, difficulty, count });
    },
    [submit],
  );

  // Handle submission for pack enrichment
  const handleSubmitEnrich = useCallback(
    (pack: StoredBriefPack) => {
      requestData.current = { id: pack.id, words: pack.set };

      // The API expects a BriefPack with 'words' and 'title'
      submit({
        words: pack.set,
        title: pack.title,
      });
    },
    [submit],
  );

  // Return typed handlers based on mode
  if (mode === "brief") {
    return {
      handleSubmit: handleSubmitBrief,
      isLoading,
      partialPack: partialPack as BriefPack | null,
    };
  } else {
    return {
      handleSubmit: handleSubmitEnrich,
      isLoading,
      partialPack: partialPack as Pack | null,
    };
  }
}
