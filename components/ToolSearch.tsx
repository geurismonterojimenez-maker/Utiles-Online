"use client";

import { useMemo, useState } from "react";
import { ToolCard } from "@/components/ToolCard";
import { categories, type Tool, type ToolCategory } from "@/lib/tools";

export function ToolSearch({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ToolCategory | "todas">("todas");

  const filteredTools = useMemo(() => {
    const search = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesCategory = category === "todas" || tool.category === category;
      const matchesSearch =
        !search ||
        [tool.name, tool.description, tool.slug, ...tool.keywords]
          .join(" ")
          .toLowerCase()
          .includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [category, query, tools]);

  return (
    <section aria-label="Buscar herramientas" className="space-y-5">
      <div className="grid gap-3 md:grid-cols-[1fr_240px]">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">Buscar herramienta</span>
          <input
            className="focus-ring w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ejemplo: comprimir PDF, QR, contador de palabras"
            type="search"
            value={query}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">Categoría</span>
          <select
            className="focus-ring w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm"
            onChange={(event) => setCategory(event.target.value as ToolCategory | "todas")}
            value={category}
          >
            <option value="todas">Todas</option>
            {Object.entries(categories).map(([key, item]) => (
              <option key={key} value={key}>{item.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
      {filteredTools.length === 0 ? (
        <p className="rounded-md border border-slate-200 bg-white p-5 text-slate-600">
          No encontramos una herramienta con ese nombre todavía.
        </p>
      ) : null}
    </section>
  );
}
