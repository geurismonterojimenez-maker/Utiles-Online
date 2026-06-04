import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdBannerTop, AdFooter, AdInContent, AdSidebar } from "@/components/AdSlot";
import { AdRailLayout } from "@/components/AdRailLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { ToolRenderer } from "@/components/tools/ToolRenderer";
import { buildToolArticle } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { categories, getRelatedTools, getTool, tools } from "@/lib/tools";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  return {
    title: tool.title,
    description: tool.metaDescription,
    alternates: { canonical: absoluteUrl(`/${tool.slug}`) },
    keywords: tool.keywords,
    openGraph: {
      title: tool.title,
      description: tool.metaDescription,
      url: absoluteUrl(`/${tool.slug}`),
      type: "article",
      siteName: siteConfig.name,
      locale: siteConfig.locale
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.metaDescription
    }
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const article = buildToolArticle(tool);
  const relatedTools = getRelatedTools(tool);
  const category = categories[tool.category];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: category.name, item: absoluteUrl(`/categorias/${category.slug}`) },
      { "@type": "ListItem", position: 3, name: tool.name, item: absoluteUrl(`/${tool.slug}`) }
    ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Cómo usar ${tool.name}`,
    description: tool.description,
    step: article.howTo.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step
    }))
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    url: absoluteUrl(`/${tool.slug}`),
    description: tool.metaDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };

  return (
    <main>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} type="application/ld+json" />
      <AdRailLayout>
        <div className="py-6">
          <AdBannerTop />
        </div>
        <div className="grid gap-8 pb-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article>
            <Breadcrumbs items={[{ label: category.name, href: `/categorias/${category.slug}` }, { label: tool.name }]} />
            <header className="mt-6">
              <p className="text-sm font-black uppercase text-teal-700">{category.name}</p>
              <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950 md:text-5xl">{tool.h1}</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{tool.description}</p>
            </header>
            <section className="mt-8" aria-label={`Herramienta ${tool.name}`}>
              <ToolRenderer tool={tool} />
            </section>
            <section className="prose-lite mt-8">
              {article.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <AdInContent />
              {article.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <h2>Cómo usar esta herramienta</h2>
              <ol>
                {article.howTo.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <h2>Preguntas frecuentes</h2>
              {tool.faqs.map((faq) => (
                <section key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </section>
              ))}
            </section>
            <section className="mt-10">
              <h2 className="mb-4 text-2xl font-black text-slate-950">Herramientas relacionadas</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedTools.map((relatedTool) => (
                  <ToolCard key={relatedTool.slug} tool={relatedTool} />
                ))}
              </div>
              <Link className="mt-5 inline-flex text-sm font-bold text-teal-700 hover:text-teal-900" href="/">
                Ver todas las herramientas
              </Link>
            </section>
          </article>
          <aside className="hidden lg:block">
            <AdSidebar />
          </aside>
        </div>
        <div className="pb-8">
          <AdFooter />
        </div>
      </AdRailLayout>
    </main>
  );
}
