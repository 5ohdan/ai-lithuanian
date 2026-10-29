"use client";

import { briefPackSchema, packSchema } from "~/lib/schemas";
import type { BriefPack, PackInput, StoredBriefPack } from "~/lib/schemas";
import { toast } from "sonner";
import { useObject } from "@ai-sdk/react";
import { getStorage } from "~/lib/storage";
import { useRouter } from "next/navigation";
import { useRef, useCallback } from "react";
import type { z } from "zod";

const storage = getStorage();

/**
 * Validates the final streamed object before persistence. The server cannot
 * reject an already-committed stream, so this is the enforcement point for
 * generated content. Returns `null` and toasts on invalid output.
 */
function validatedFinalPack<O>(schema: z.ZodType<O>, object: unknown): O | null {
  const parsed = schema.safeParse(object);
  if (!parsed.success) {
    console.error(
      "Final pack failed validation:",
      parsed.error.issues.map((e) => e.message).join("\n"),
    );
    toast.error("The generated pack was incomplete. Please try again.");
    return null;
  }
  return parsed.data;
}

type GenerationOutcome = { onSuccess?: (packId: string) => void };

/** Generates a brief pack from a topic. */
export function useBriefGeneration(options: GenerationOutcome = {}) {
  const { onSuccess } = options;
  const router = useRouter();
  const requestData = useRef<PackInput | null>(null);

  const {
    submit,
    isLoading,
    object: partialPack,
  } = useObject({
    api: "/api/words/brief",
    schema: briefPackSchema,
    onError: (error: Error) => {
      toast.error(`Failed to generate pack. Please try again. ${error.message}`);
    },
    onFinish: ({ object }) => {
      const briefPack = validatedFinalPack(briefPackSchema, object);
      if (!briefPack) return;
      toast.success("Successfully generated a pack.");

      if (!requestData.current) {
        console.error("Missing request data for the current mode");
        return;
      }
      const { difficulty, topic } = requestData.current;
      const packId = storage.addBriefPack(briefPack, difficulty, topic);

      if (onSuccess) {
        onSuccess(packId);
      } else {
        router.push(`/cards/${packId}`);
      }
    },
  });

  const handleGenerate = useCallback(
    (data: PackInput) => {
      requestData.current = data;
      submit({ topic: data.topic, difficulty: data.difficulty, count: data.count });
    },
    [submit],
  );

  return {
    handleGenerate,
    isLoading,
    partialPack: partialPack as BriefPack | null,
  };
}

/** Enriches a saved brief pack in place (brief → full). */
export function useEnrichment(options: GenerationOutcome = {}) {
  const { onSuccess } = options;
  const router = useRouter();
  const briefPackId = useRef<string | null>(null);

  const {
    submit,
    isLoading,
    object: partialPack,
  } = useObject({
    api: "/api/words/enrich",
    schema: packSchema,
    onError: (error: Error) => {
      toast.error(`Failed to enrich pack. Please try again. ${error.message}`);
    },
    onFinish: ({ object }) => {
      const fullPack = validatedFinalPack(packSchema, object);
      if (!fullPack) return;

      if (!briefPackId.current) {
        console.error("Missing brief pack id for enrichment");
        return;
      }
      const result = storage.enrichPack(briefPackId.current, fullPack);
      if (!result.ok) {
        toast.error(
          "The enriched pack could not be saved (original not found). Please generate again.",
        );
        return;
      }
      toast.success("Successfully enriched a pack.");

      if (onSuccess) {
        onSuccess(result.id);
      } else {
        router.push(`/cards/${result.id}`);
      }
    },
  });

  const handleEnrichment = useCallback(
    (pack: StoredBriefPack) => {
      briefPackId.current = pack.id;
      // The API receives the brief pack to enrich as given.
      submit({ words: pack.words, title: pack.title });
    },
    [submit],
  );

  return {
    handleEnrichment,
    isLoading,
    partialPack,
  };
}
