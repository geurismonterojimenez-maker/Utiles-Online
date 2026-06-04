import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdRailLayout } from "@/components/AdRailLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { getPost, posts } from "@/lib/blog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: absoluteUrl(`/blog/${post.slug}`) },
    openGraph: {
      title: post.title,
      description: post.description,
      url: absoluteUrl(`/blog/${post.slug}`),
      type: "article",
      siteName: siteConfig.name
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="py-10">
      <AdRailLayout>
        <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
        <article className="prose-lite mt-6 max-w-3xl">
          <p className="text-sm font-black uppercase text-teal-700">{post.date}</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950">{post.title}</h1>
          <p>{post.description}</p>
          <h2>Por qué importa</h2>
          <p>
            Las herramientas online más útiles son aquellas que resuelven una intención concreta, cargan rápido y explican el resultado sin rodeos. Para un sitio orientado a SEO, el contenido informativo ayuda a responder dudas antes y después de usar la herramienta.
          </p>
          <p>
            Este blog está listo para publicar guías, comparativas, tutoriales y contenidos de apoyo. Cada artículo puede enlazar a herramientas relacionadas para mejorar la navegación interna y aportar valor real al usuario.
          </p>
          <h2>Buenas prácticas</h2>
          <ul>
            <li>Usar títulos claros que respondan a una búsqueda específica.</li>
            <li>Evitar promesas exageradas o contenido duplicado.</li>
            <li>Priorizar rendimiento móvil, accesibilidad y lectura cómoda.</li>
            <li>Separar anuncios de botones y acciones principales.</li>
          </ul>
        </article>
      </AdRailLayout>
    </main>
  );
}
