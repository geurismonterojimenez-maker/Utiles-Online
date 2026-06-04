"use client";

import { useMemo, useState } from "react";

export function TextSummary() {
  const [text, setText] = useState("");
  const summary = useMemo(() => {
    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);
    return sentences.slice(0, 3).join(" ");
  }, [text]);

  return (
    <div className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
      <textarea
        className="focus-ring min-h-56 resize-y rounded-md border border-slate-300 px-4 py-3"
        onChange={(event) => setText(event.target.value)}
        placeholder="Pega el texto que quieres resumir..."
        value={text}
      />
      <div className="rounded-md bg-slate-50 p-4">
        <p className="mb-2 text-sm font-black text-slate-700">Resumen</p>
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {summary || "El resumen aparecerá aquí. Esta versión toma las primeras ideas principales y queda lista para mejorar con IA o reglas avanzadas."}
        </p>
      </div>
    </div>
  );
}
