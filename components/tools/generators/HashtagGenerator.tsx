"use client";

import { useMemo, useState } from "react";

export function HashtagGenerator() {
  const [topic, setTopic] = useState("");

  const hashtags = useMemo(() => {
    const words = topic
      .split(/[\s,;]+/)
      .map((word) => word.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
      .map((word) => word.replace(/[^\w]/g, "").toLowerCase())
      .filter(Boolean);
    const base = words.length ? words : ["contenido", "online", "tips"];
    const combinations = [
      ...base,
      `${base[0]}tips`,
      `${base[0]}online`,
      `${base[0]}gratis`,
      `aprende${base[0]}`,
      `${base[0]}facil`
    ];
    return Array.from(new Set(combinations)).slice(0, 12).map((tag) => `#${tag}`);
  }, [topic]);

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <label className="block text-sm font-bold text-slate-700">
        Tema o palabras clave
        <input
          className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-4 py-3"
          onChange={(event) => setTopic(event.target.value)}
          placeholder="Ejemplo: marketing digital"
          value={topic}
        />
      </label>
      <div className="mt-5 flex flex-wrap gap-2">
        {hashtags.map((hashtag) => (
          <span className="rounded-md bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700" key={hashtag}>
            {hashtag}
          </span>
        ))}
      </div>
    </div>
  );
}
