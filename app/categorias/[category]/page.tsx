import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdBannerTop, AdFooter } from "@/components/AdSlot";
import { AdRailLayout } from "@/components/AdRailLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { categories, getToolsByCategory, type ToolCategory } from "@/lib/tools";

type PageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return Object.values(categories).map((category) => ({ category: category.slug }));
}

function findCategory(slug: string) {
  return Object.entries(categories).find(([, category]) => category.slug === slug) as
    | [ToolCategory, (typeof categories)[ToolCategory]]
    | undefined;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const entry = findCategory(slug);
  if (!entry) return {};
  const [, category] = entry;
  const title = `${category.name} online gratis`;

  return {
    title,
    description: category.description,
    alternates: { canonical: absoluteUrl(`/categorias/${category.slug}`) },
    openGraph: {
      title,
      description: category.description,
      url: absoluteUrl(`/categorias/${category.slug}`),
      siteName: siteConfig.name,
      locale: siteConfig.locale
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: category.description
    }
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const entry = findCategory(slug);
  if (!entry) notFound();
  const [key, category] = entry;
  const categoryTools = getToolsByCategory(key);

  return (
    <main className="py-6">
      <AdRailLayout>
        <AdBannerTop />
        <div className="py-8">
          <Breadcrumbs items={[{ label: category.name }]} />
          <h1 className="mt-5 text-3xl font-black text-slate-950 md:text-5xl">{category.name}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{category.description}</p>
        </div>
        <section className="prose-lite mb-8 rounded-md border border-slate-200 bg-white p-6">
          <h2>Herramientas de {category.name.toLowerCase()} para tareas diarias</h2>
          <p>
            Esta categoría reúne utilidades con intención de búsqueda clara, interfaz rápida y páginas preparadas para posicionamiento orgánico. Cada herramienta tiene URL propia, explicación, preguntas frecuentes y enlaces internos relacionados.
          </p>
          <p>
            La estructura está pensada para crecer de forma ordenada: puedes agregar nuevas herramientas, ampliar guías de uso, conectar procesamiento real mediante API routes y mantener anuncios separados de las acciones principales.
          </p>
        </section>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </section>
        <div className="py-8">
          <AdFooter />
        </div>
      </AdRailLayout>
    </main>
  );
}
