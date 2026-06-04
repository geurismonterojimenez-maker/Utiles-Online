import OpenAI from "openai";
import { NextResponse } from "next/server";

import type { GenerateContentPayload } from "@/lib/ai/types";
import { getClientKey, rateLimit } from "@/lib/security";

export const runtime = "nodejs";

const MAX_RESULTS = 12;
const MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

export async function POST(request: Request) {
  const limited = rateLimit(`ai:${getClientKey(request)}`, 20, 60_000);
  if (!limited.allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos." }, { status: 429 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "GROQ_API_KEY no esta configurada en el servidor." }, { status: 503 });
  }

  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
  });

  let payload: GenerateContentPayload;
  try {
    payload = (await request.json()) as GenerateContentPayload;
  } catch {
    return NextResponse.json({ error: "El cuerpo de la solicitud no es JSON valido." }, { status: 400 });
  }

  const tema = cleanInput(payload.tema, 120);
  const tono = cleanInput(payload.tono, 60);
  const tipo = cleanInput(payload.tipo, 80);
  const idioma = cleanInput(payload.idioma, 40);
  const cantidad = clamp(Number(payload.cantidad) || 6, 1, MAX_RESULTS);

  if (!tema || !tono || !tipo || !idioma) {
    return NextResponse.json({ error: "Faltan campos requeridos: tema, tono, tipo o idioma." }, { status: 400 });
  }

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.85,
      max_tokens: 900,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Eres un experto en copywriting moderno para redes sociales. Generas contenido natural, creativo, moderno y humano. Nunca uses frases genericas ni repetidas. Los resultados deben sentirse reales y atractivos. Responde siempre con JSON valido y nada mas."
        },
        {
          role: "user",
          content: buildPrompt({
            ...payload,
            tema,
            tono,
            tipo,
            idioma,
            cantidad
          })
        }
      ]
    });

    const raw = completion.choices[0]?.message.content || "";
    const results = extractResults(raw, cantidad, { herramienta: payload.herramienta, idioma, tema, tipo, tono });

    if (!results.length) {
      return NextResponse.json({ error: "La IA no devolvio resultados validos." }, { status: 502 });
    }

    return NextResponse.json({ results, source: "groq" });
  } catch (error) {
    console.error("Groq generation failed", error);
    return NextResponse.json({ error: "Groq no pudo generar contenido en este momento." }, { status: 502 });
  }
}

function buildPrompt(payload: GenerateContentPayload) {
  const toolRules = toolSpecificRules(payload);
  return [
    `Genera ${payload.cantidad} resultados sobre "${payload.tema}".`,
    `Herramienta: ${payload.herramienta || "generador de contenido"}`,
    `Tipo: ${payload.tipo}`,
    `Tono: ${payload.tono}`,
    `Idioma: ${payload.idioma}`,
    `Emojis: ${payload.emojis ? "Si" : "No"}`,
    `CTA: ${payload.cta ? "Si" : "No"}`,
    payload.patterns?.length ? `Patrones base permitidos:\n${payload.patterns.slice(0, 12).map((pattern) => `- ${pattern}`).join("\n")}` : "",
    "",
    "Reglas:",
    "- Maximo 150 caracteres por resultado",
    "- Sonido natural",
    "- Estilo moderno",
    "- Variaciones reales",
    "- No repetir estructuras",
    "- Cada resultado debe tener una sola idea clara",
    "- Evita frases raras, tecnicas inventadas o combinaciones sin sentido",
    "- No inventes datos especificos si el usuario no los pidio",
    payload.patterns?.length ? "- Usa esos patrones como estructura base. Puedes variar palabras, pero no inventes estructuras raras." : "",
    ...toolRules,
    "- No uses comillas alrededor de cada texto salvo las necesarias del JSON",
    '- Devuelve solo este JSON: {"results":["...","..."]}'
  ].join("\n");
}

function toolSpecificRules(_payload: GenerateContentPayload) {
  return [];
}

function extractResults(raw: string, amount: number, context: Pick<GenerateContentPayload, "herramienta" | "idioma" | "tema" | "tipo" | "tono">) {
  let parsed: Record<string, unknown> | unknown[];
  try {
    parsed = JSON.parse(raw) as Record<string, unknown> | unknown[];
  } catch {
    return normalizeResults(fallbackLines(raw), amount, context);
  }

  const candidates = Array.isArray(parsed)
    ? parsed
    : parsed.results || parsed.result || parsed.ideas || parsed.titles || parsed.bios || parsed.items || fallbackLines(raw);

  return normalizeResults(candidates, amount, context);
}

function normalizeResults(candidates: unknown, amount: number, context: Pick<GenerateContentPayload, "herramienta" | "idioma" | "tema" | "tipo" | "tono">) {
  const unique = new Set<string>();
  if (!Array.isArray(candidates)) {
    return [];
  }

  for (const item of candidates) {
    const text = resultText(item);
    if (!text) {
      continue;
    }
    const cleaned = text.replace(/\s+/g, " ").trim();
    if (cleaned && passesQuality(cleaned, context)) {
      unique.add(limitText(cleaned, 150));
    }
  }

  return Array.from(unique).slice(0, amount);
}

function passesQuality(value: string, context: Pick<GenerateContentPayload, "herramienta" | "idioma" | "tema">) {
  const normalized = value.toLowerCase();

  if (normalized.includes("#") || /@\w+/.test(normalized)) {
    return false;
  }

  void context;
  return value.length >= 20;
}

function resultText(item: unknown) {
  if (typeof item === "string") {
    return item;
  }

  if (item && typeof item === "object") {
    const record = item as Record<string, unknown>;
    const value = record.text || record.title || record.titulo || record.bio || record.biografia || record.caption || record.description || record.descripcion;
    return typeof value === "string" ? value : "";
  }

  return "";
}

function limitText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  const trimmed = value.slice(0, maxLength - 2);
  const lastSpace = trimmed.lastIndexOf(" ");
  return `${trimmed.slice(0, lastSpace > 80 ? lastSpace : maxLength - 3).replace(/[,.!?;:\s]+$/g, "")}...`;
}

function fallbackLines(raw: string) {
  return raw
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*\d.\s"']+|["']+$/g, "").trim())
    .filter(Boolean);
}

function cleanInput(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, maxLength) : "";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
