"use client";

import { useMemo, useState } from "react";

export function APAGenerator() {
  const [author, setAuthor] = useState("García, M.");
  const [year, setYear] = useState("2026");
  const [title, setTitle] = useState("Título del recurso");
  const [source, setSource] = useState("Nombre del sitio o editorial");
  const [url, setUrl] = useState("https://ejemplo.com");

  const reference = useMemo(
    () => `${author || "Autor"}. (${year || "s. f."}). ${title || "Título"}. ${source || "Fuente"}. ${url || ""}`.trim(),
    [author, year, title, source, url]
  );

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <Input label="Autor" onChange={setAuthor} value={author} />
        <Input label="Año" onChange={setYear} value={year} />
        <Input label="Título" onChange={setTitle} value={title} />
        <Input label="Fuente" onChange={setSource} value={source} />
        <Input label="URL" onChange={setUrl} value={url} />
      </div>
      <div className="mt-5 rounded-md bg-slate-50 p-4">
        <p className="mb-2 text-sm font-black text-slate-700">Referencia APA básica</p>
        <p className="text-sm leading-6 text-slate-700">{reference}</p>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <input className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-4 py-3" onChange={(event) => onChange(event.target.value)} value={value} />
    </label>
  );
}
