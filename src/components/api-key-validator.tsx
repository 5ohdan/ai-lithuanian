"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { ValidationError } from "~/utils/auth";

interface ApiKeyValidatorProps {
  keyRemoved?: boolean;
  error?: ValidationError;
}

export function ApiKeyValidator({ keyRemoved, error }: ApiKeyValidatorProps) {
  const router = useRouter();

  useEffect(() => {
    if (keyRemoved) {
      toast.error(
        `Your API key has been removed because it was invalid: ${error?.message ?? "Unknown error"}`,
        {
          description: "Please provide a valid OpenAI API key",
          action: {
            label: "Add Key",
            onClick: () => router.push("/key-form"),
          },
        },
      );
    }
  }, [keyRemoved, error, router]);

  return null;
}
