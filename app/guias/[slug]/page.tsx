import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdInContent } from "@/components/AdSlot";
import { AdRailLayout } from "@/components/AdRailLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { getSeoPage, seoPages } from "@/lib/seo-pages";
import { getTool } from "@/lib/tools";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return seoPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: absoluteUrl(`/guias/${page.slug}`) },
    openGraph: {
      title: page.title,
      description: page.description,
      url: absoluteUrl(`/guias/${page.slug}`),
      type: "article",
      siteName: siteConfig.name
    }
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) notFound();

  const relatedTools = page.relatedTools.map((toolSlug) => getTool(toolSlug)).filter(Boolean);

  return (
    <main className="py-10">
      <AdRailLayout>
        <Breadcrumbs items={[{ label: "Guías", href: "/guias" }, { label: page.title }]} />
        <article className="prose-lite mt-6 max-w-3xl">
          <p className="text-sm font-black uppercase text-teal-700">{page.intent}</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950">{page.h1}</h1>
          <p>{page.description}</p>
          <AdInContent />
          {page.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          <h2>Herramientas recomendadas</h2>
          <p>
            Estas herramientas están relacionadas con la intención de búsqueda de esta guía y ayudan a completar el flujo sin salir de UtilesOnline.
          </p>
        </article>
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {relatedTools.map((tool) => (
            tool ? <ToolCard key={tool.slug} tool={tool} /> : null
          ))}
        </section>
        <Link className="mt-6 inline-flex text-sm font-bold text-teal-700 hover:text-teal-900" href="/guias">
          Ver más guías
        </Link>
      </AdRailLayout>
    </main>
  );
}
