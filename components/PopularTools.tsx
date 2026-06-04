import { ToolCard } from "@/components/ToolCard";
import { getTool } from "@/lib/tools";

const popularSlugs = [
  "comprimir-pdf",
  "contador-palabras",
  "generador-qr",
  "calculadora-porcentaje",
  "generador-contrasenas",
  "redimensionar-imagen"
];

export function PopularTools() {
  const popularTools = popularSlugs.map((slug) => getTool(slug)).filter(Boolean);

  return (
    <section className="py-8">
      <div className="mb-6 max-w-2xl">
        <h2 className="text-2xl font-black text-slate-950">Herramientas populares</h2>
        <p className="mt-2 text-slate-600">
          Accesos rápidos a utilidades con alta intención de búsqueda y uso frecuente.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {popularTools.map((tool) => (tool ? <ToolCard key={tool.slug} tool={tool} /> : null))}
      </div>
    </section>
  );
}
