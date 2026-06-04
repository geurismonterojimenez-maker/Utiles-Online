import Link from "next/link";
import { categories } from "@/lib/tools";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-lg font-black text-teal-800">{siteConfig.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
            Herramientas online rápidas para documentos, imágenes, texto, generadores y calculadoras.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-black uppercase text-slate-500">Categorías</p>
          <ul className="space-y-2 text-sm text-slate-600">
            {Object.values(categories).map((category) => (
              <li key={category.slug}>
                <Link className="hover:text-teal-700" href={`/categorias/${category.slug}`}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-black uppercase text-slate-500">Legal</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link className="hover:text-teal-700" href="/blog">Blog</Link></li>
            <li><Link className="hover:text-teal-700" href="/guias">Guías y comparativas</Link></li>
            <li><Link className="hover:text-teal-700" href="/sobre-nosotros">Sobre nosotros</Link></li>
            <li><Link className="hover:text-teal-700" href="/contacto">Contacto</Link></li>
            <li><Link className="hover:text-teal-700" href="/politica-privacidad">Política de privacidad</Link></li>
            <li><Link className="hover:text-teal-700" href="/terminos-uso">Términos de uso</Link></li>
            <li><Link className="hover:text-teal-700" href="/politica-cookies">Política de cookies</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
