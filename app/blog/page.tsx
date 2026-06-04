import type { Metadata } from "next";
import Link from "next/link";
import { AdRailLayout } from "@/components/AdRailLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { absoluteUrl } from "@/lib/site";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog SEO",
  description: "Guías y consejos para usar herramientas online, optimizar archivos y trabajar mejor desde el navegador.",
  alternates: { canonical: absoluteUrl("/blog") }
};

export default function BlogPage() {
  return (
    <main className="py-10">
      <AdRailLayout>
        <Breadcrumbs items={[{ label: "Blog" }]} />
        <h1 className="mt-5 text-4xl font-black text-slate-950">Blog SEO</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Artículos preparados para captar búsquedas informativas y conectar con las herramientas principales.
        </p>
        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <article className="rounded-md border border-slate-200 bg-white p-5 shadow-sm" key={post.slug}>
              <p className="text-xs font-black uppercase text-slate-500">{post.date}</p>
              <h2 className="mt-3 text-xl font-black text-slate-950">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{post.description}</p>
            </article>
          ))}
        </section>
      </AdRailLayout>
    </main>
  );
}
