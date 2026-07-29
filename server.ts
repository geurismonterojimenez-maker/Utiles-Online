import express from "express";
import compression from "compression";
import path from "node:path";
import fs from "node:fs";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const ORIGIN = "https://utilesonline.com";
const pages: Record<string, { title: string; description: string; type?: string }> = {
  "/": { title: "Útiles Online | Herramientas gratuitas para estudiar mejor", description: "Calculadoras académicas, herramientas de escritura y recursos gratuitos para estudiantes y docentes." },
  "/calculadora-de-notas": { title: "Calculadora de notas y promedio ponderado | Útiles Online", description: "Calcula gratis tu promedio simple o ponderado y descubre si estás aprobando.", type: "SoftwareApplication" },
  "/nota-necesaria-para-aprobar": { title: "Calculadora de nota necesaria para aprobar | Útiles Online", description: "Descubre qué calificación necesitas en el examen final para alcanzar el promedio deseado.", type: "SoftwareApplication" },
  "/contador-de-palabras": { title: "Contador de palabras y caracteres gratis | Útiles Online", description: "Cuenta palabras, caracteres, oraciones y tiempo de lectura sin enviar ni guardar tu texto.", type: "SoftwareApplication" },
  "/generador-apa": { title: "Generador de referencias APA 7 gratis | Útiles Online", description: "Crea referencias APA 7 para libros y páginas web de forma rápida y gratuita.", type: "SoftwareApplication" },
  "/temporizador-pomodoro": { title: "Temporizador Pomodoro online para estudiar | Útiles Online", description: "Temporizador Pomodoro gratuito con sesiones de concentración y descansos.", type: "SoftwareApplication" },
  "/creador-de-horarios": { title: "Creador de horarios escolares gratis | Útiles Online", description: "Organiza clases y actividades en un horario semanal que puedes imprimir o guardar como PDF.", type: "SoftwareApplication" },
  "/acerca-de": { title: "Acerca de Útiles Online", description: "Conoce el propósito y los principios de Útiles Online." },
  "/privacidad": { title: "Política de privacidad | Útiles Online", description: "Información sobre privacidad y tratamiento de datos en Útiles Online." },
  "/contacto": { title: "Contacto | Útiles Online", description: "Formas de contactar con el equipo de Útiles Online." }
};
app.disable("x-powered-by");
app.use((req, res, next) => req.hostname.toLowerCase() === "www.utilesonline.com" ? res.redirect(301, `${ORIGIN}${req.originalUrl}`) : next());
app.use(compression());
app.use((_req, res, next) => { res.setHeader("X-Content-Type-Options", "nosniff"); res.setHeader("X-Frame-Options", "SAMEORIGIN"); res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin"); res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()"); next(); });
app.get("/robots.txt", (_req, res) => res.type("text/plain").send(`User-agent: *\nAllow: /\nSitemap: ${ORIGIN}/sitemap.xml\n`));
app.get("/sitemap.xml", (_req, res) => {
  const urls = Object.keys(pages).map(route => `<url><loc>${ORIGIN}${route}</loc><changefreq>${route === "/" ? "weekly" : "monthly"}</changefreq><priority>${route === "/" ? "1.0" : "0.8"}</priority></url>`).join("");
  res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
});
const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath, { index: false, maxAge: "7d" }));
function render(pathname: string) {
  const meta = pages[pathname]; if (!meta) return null;
  const canonical = `${ORIGIN}${pathname}`;
  const schema = meta.type ? { "@context": "https://schema.org", "@type": meta.type, name: meta.title.split(" | ")[0], description: meta.description, url: canonical, applicationCategory: "EducationalApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } } : { "@context": "https://schema.org", "@type": "WebPage", name: meta.title, description: meta.description, url: canonical, inLanguage: "es" };
  return fs.readFileSync(path.join(distPath, "index.html"), "utf8")
    .replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${meta.description}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${meta.title}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${meta.description}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace("</head>", `<script type="application/ld+json">${JSON.stringify(schema)}</script></head>`);
}
app.get("*", (req, res) => {
  const html = render(req.path.replace(/\/+$/, "") || "/");
  if (html) return res.status(200).type("html").send(html);
  return res.status(404).type("html").send('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>Página no encontrada | Útiles Online</title></head><body><main><h1>Página no encontrada</h1><p>La dirección solicitada no existe.</p><a href="/">Volver al inicio</a></main></body></html>');
});
app.listen(PORT, "0.0.0.0", () => console.log(`Útiles Online running on port ${PORT}`));
