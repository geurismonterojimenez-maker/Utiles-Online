"use client";

import { useMemo, useState } from "react";

export function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => {
    const words = text.trim().match(/\S+/g)?.length ?? 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?]+/).filter((item) => item.trim()).length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    return { words, characters, charactersNoSpaces, sentences, minutes };
  }, [text]);

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <textarea
        className="focus-ring min-h-52 w-full resize-y rounded-md border border-slate-300 px-4 py-3"
        onChange={(event) => setText(event.target.value)}
        placeholder="Pega o escribe tu texto aquí..."
        value={text}
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Palabras", stats.words],
          ["Caracteres", stats.characters],
          ["Sin espacios", stats.charactersNoSpaces],
          ["Frases", stats.sentences],
          ["Lectura", `${stats.minutes} min`]
        ].map(([label, value]) => (
          <div className="rounded-md bg-slate-50 p-4" key={label}>
            <p className="text-xs font-black uppercase text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-black text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
