"use client";

import { useCallback, useRef, useState } from "react";

import { generateContent } from "@/lib/ai/client";
import type { GenerateContentPayload, GenerateContentResponse } from "@/lib/ai/types";

type GenerateOptions = {
  fallback: () => string[];
  onSuccess?: (response: GenerateContentResponse) => void;
};

export function useAiGeneration() {
  const abortRef = useRef<AbortController | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState<GenerateContentResponse["source"]>("fallback");

  const generate = useCallback(async (payload: GenerateContentPayload, options: GenerateOptions) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError("");

    try {
      const response = await generateContent(payload, controller.signal);
      setSource(response.source);
      options.onSuccess?.(response);
      return response.results;
    } catch (cause) {
      if (controller.signal.aborted) {
        return [];
      }

      const fallbackResults = options.fallback();
      const message = cause instanceof Error ? cause.message : "La IA no respondio correctamente.";
      setError(`${message} Se usaron ideas locales como respaldo.`);
      setSource("fallback");
      return fallbackResults;
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
      setLoading(false);
    }
  }, []);

  return { error, generate, loading, source };
}
