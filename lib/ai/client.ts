import type { GenerateContentPayload, GenerateContentResponse } from "./types";

export async function generateContent(payload: GenerateContentPayload, signal?: AbortSignal): Promise<GenerateContentResponse> {
  const response = await fetch("/api/generate", {
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    signal
  });

  const data = (await response.json().catch(() => null)) as Partial<GenerateContentResponse> & { error?: string } | null;

  if (!response.ok) {
    throw new Error(data?.error || "No se pudo generar contenido con IA.");
  }

  if (!data || !Array.isArray(data.results)) {
    throw new Error("La respuesta de IA no tuvo el formato esperado.");
  }

  return {
    results: data.results,
    source: data.source === "groq" ? "groq" : "fallback"
  };
}
