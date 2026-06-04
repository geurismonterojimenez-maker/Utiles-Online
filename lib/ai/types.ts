export type AiTool =
  | "caption"
  | "description"
  | "content-ideas";

export type GenerateContentPayload = {
  tema: string;
  tono: string;
  tipo: string;
  cantidad: number;
  idioma: string;
  emojis?: boolean;
  cta?: boolean;
  herramienta?: AiTool;
  patterns?: string[];
};

export type GenerateContentResponse = {
  results: string[];
  source: "groq" | "fallback";
};

export type GenerateContentError = {
  error: string;
};
