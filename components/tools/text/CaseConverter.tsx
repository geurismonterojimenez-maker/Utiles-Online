"use client";

import { useState } from "react";

function titleCase(value: string) {
  return value.toLowerCase().replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
}

function sentenceCase(value: string) {
  return value
    .toLowerCase()
    .replace(/(^\s*\p{L}|[.!?]\s*\p{L})/gu, (match) => match.toUpperCase());
}

export function CaseConverter() {
  const [text, setText] = useState("");

  const apply = (mode: "upper" | "lower" | "title" | "sentence") => {
    const nextValue = {
      upper: text.toUpperCase(),
      lower: text.toLowerCase(),
      title: titleCase(text),
      sentence: sentenceCase(text)
    }[mode];
    setText(nextValue);
  };

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <textarea
        className="focus-ring min-h-48 w-full resize-y rounded-md border border-slate-300 px-4 py-3"
        onChange={(event) => setText(event.target.value)}
        placeholder="Escribe el texto que quieres convertir..."
        value={text}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white" onClick={() => apply("upper")} type="button">MAYÚSCULAS</button>
        <button className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white" onClick={() => apply("lower")} type="button">minúsculas</button>
        <button className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white" onClick={() => apply("title")} type="button">Título</button>
        <button className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white" onClick={() => apply("sentence")} type="button">Oración</button>
      </div>
    </div>
  );
}
