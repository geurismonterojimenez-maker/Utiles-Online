import Link from "next/link";
import { AdBannerTop, AdFooter, AdInContent } from "@/components/AdSlot";
import { AdRailLayout } from "@/components/AdRailLayout";
import { PopularTools } from "@/components/PopularTools";
import { ToolSearch } from "@/components/ToolSearch";
import { categories, tools } from "@/lib/tools";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  return (
    <main>
      <section className="bg-white">
        <AdRailLayout>
          <div className="grid gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
            <div>
              <p className="text-sm font-black uppercase text-teal-700">{siteConfig.tagline}</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-slate-950 md:text-5xl">
                Herramientas online rapidas para documentos, imagenes, texto y calculos
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Usa utilidades simples desde el navegador: convierte documentos, optimiza imagenes, cuenta palabras, genera codigos QR y resuelve calculos frecuentes.
              </p>
            </div>
            <div className="grid content-start gap-3 rounded-md border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-black uppercase text-slate-500">Categorias</p>
              {Object.values(categories).map((category) => (
                <Link className="rounded-md bg-white p-4 font-bold text-slate-800 shadow-sm hover:text-teal-700" href={`/categorias/${category.slug}`} key={category.slug}>
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </AdRailLayout>
      </section>
      <AdRailLayout>
        <div className="py-6">
          <AdBannerTop />
        </div>
        <PopularTools />
        <section className="py-8">
          <div className="mb-6 max-w-2xl">
            <h2 className="text-2xl font-black text-slate-950">Todas las herramientas</h2>
            <p className="mt-2 text-slate-600">
              Busca por nombre o explora por categoria. Cada herramienta esta pensada para una tarea concreta y funciona bien en movil.
            </p>
          </div>
          <ToolSearch tools={tools} />
        </section>
        <section className="py-6">
          <AdInContent />
        </section>
        <section className="py-8">
          <div className="prose-lite rounded-md border border-slate-200 bg-white p-6">
            <h2>Herramientas simples para tareas diarias</h2>
            <p>
              UtilesOnline reune utilidades rapidas para trabajar con archivos, textos, imagenes y calculos sin instalar programas adicionales.
            </p>
            <p>
              Los anuncios, cuando esten activos, se muestran separados de botones y zonas de accion para mantener una experiencia clara.
            </p>
          </div>
        </section>
        <div className="py-6">
          <AdFooter />
        </div>
      </AdRailLayout>
    </main>
  );
}
