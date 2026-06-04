import Link from "next/link";
import { categories, type Tool } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md">
      <p className="mb-3 text-xs font-black uppercase text-teal-700">
        {categories[tool.category].name}
      </p>
      <h2 className="text-lg font-black text-slate-900">
        <Link href={`/${tool.slug}`}>{tool.name}</Link>
      </h2>
      <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{tool.description}</p>
      <Link
        className="focus-ring mt-4 inline-flex rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800"
        href={`/${tool.slug}`}
      >
        Abrir herramienta
      </Link>
    </article>
  );
}
