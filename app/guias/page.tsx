import type { Metadata } from "next";
import Link from "next/link";
import { AdRailLayout } from "@/components/AdRailLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { absoluteUrl } from "@/lib/site";
import { seoPages } from "@/lib/seo-pages";

export const metadata: Metadata = {
  title: "Guías y comparativas",
  description: "Guías SEO, comparativas y casos de uso para herramientas online de documentos, imágenes, texto y cálculo.",
  alternates: { canonical: absoluteUrl("/guias") }
};

export default function GuidesPage() {
  return (
    <main className="py-10">
      <AdRailLayout>
        <Breadcrumbs items={[{ label: "Guías" }]} />
        <h1 className="mt-5 text-4xl font-black text-slate-950">Guías y comparativas</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Contenido long-tail para resolver dudas específicas y conectar usuarios con la herramienta adecuada.
        </p>
        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {seoPages.map((page) => (
            <article className="rounded-md border border-slate-200 bg-white p-5 shadow-sm" key={page.slug}>
              <p className="text-xs font-black uppercase text-teal-700">{page.intent}</p>
              <h2 className="mt-3 text-xl font-black text-slate-950">
                <Link href={`/guias/${page.slug}`}>{page.title}</Link>
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{page.description}</p>
            </article>
          ))}
        </section>
      </AdRailLayout>
    </main>
  );
}
