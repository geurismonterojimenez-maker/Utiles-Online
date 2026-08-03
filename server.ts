import express from "express";
import compression from "compression";
import path from "node:path";
import fs from "node:fs";
import { CONTENT } from "./src/content";
import { EXTRA_TOOL_CATALOG, getToolSeoDetails } from "./src/studyTools";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const ORIGIN = "https://utilesonline.com";
const pages: Record<string, { title: string; description: string; type?: string; noindex?: boolean }> = {
  "/": { title: "Útiles Online | Herramientas gratuitas para estudiar mejor", description: "Calculadoras académicas, herramientas de escritura y recursos gratuitos para estudiantes y docentes." },
  "/calculadora-de-notas": { title: "Calculadora de notas y promedio ponderado | Útiles Online", description: "Calcula gratis tu promedio simple o ponderado y descubre si estás aprobando.", type: "SoftwareApplication" },
  "/nota-necesaria-para-aprobar": { title: "Calculadora de nota necesaria para aprobar | Útiles Online", description: "Descubre qué calificación necesitas en el examen final para alcanzar el promedio deseado.", type: "SoftwareApplication" },
  "/calculadora-gpa": { title: "Calculadora de GPA universitario gratis | Útiles Online", description: "Calcula tu GPA en escala 4.0 según las calificaciones y créditos de cada materia.", type: "SoftwareApplication" },
  "/conversor-de-calificaciones": { title: "Conversor de calificaciones y escalas | Útiles Online", description: "Convierte notas proporcionalmente entre escalas de 5, 10, 20 y 100 puntos.", type: "SoftwareApplication" },
  "/calculadora-de-asistencia": { title: "Calculadora de asistencia escolar | Útiles Online", description: "Calcula tu porcentaje de asistencia y comprueba si cumples el mínimo requerido.", type: "SoftwareApplication" },
  "/contador-de-palabras": { title: "Contador de palabras y caracteres gratis | Útiles Online", description: "Cuenta palabras, caracteres, oraciones y tiempo de lectura sin enviar ni guardar tu texto.", type: "SoftwareApplication" },
  "/generador-apa": { title: "Generador de referencias APA 7 gratis | Útiles Online", description: "Crea referencias APA 7 para libros y páginas web de forma rápida y gratuita.", type: "SoftwareApplication" },
  "/generador-de-portadas": { title: "Generador de portadas académicas | Útiles Online", description: "Crea una portada académica clara y guárdala como PDF para tu trabajo.", type: "SoftwareApplication" },
  "/limpiador-de-texto": { title: "Limpiador de texto online gratis | Útiles Online", description: "Elimina espacios duplicados y corrige el formato básico de un texto en tu navegador.", type: "SoftwareApplication" },
  "/temporizador-pomodoro": { title: "Temporizador Pomodoro online para estudiar | Útiles Online", description: "Temporizador Pomodoro gratuito con sesiones de concentración y descansos.", type: "SoftwareApplication" },
  "/creador-de-horarios": { title: "Creador de horarios escolares gratis | Útiles Online", description: "Organiza clases y actividades en un horario semanal que puedes imprimir o guardar como PDF.", type: "SoftwareApplication" },
  "/calculadora-cientifica": { title: "Calculadora científica online gratis | Útiles Online", description: "Calcula potencias, raíces, logaritmos y funciones trigonométricas.", type: "SoftwareApplication" },
  "/conversor-de-unidades": { title: "Conversor de unidades online | Útiles Online", description: "Convierte longitud, masa y tiempo con factores estándar.", type: "SoftwareApplication" },
  "/planificador-de-tareas": { title: "Planificador de tareas y exámenes | Útiles Online", description: "Organiza tareas, entregas y exámenes por prioridad y fecha en tu navegador.", type: "SoftwareApplication" },
  "/calculadoras-academicas": { title: "Calculadoras académicas gratuitas | Útiles Online", description: "Calculadoras de notas, GPA, asistencia y escalas para estudiantes." },
  "/herramientas-de-escritura": { title: "Herramientas de escritura académica | Útiles Online", description: "Recursos gratuitos para contar, limpiar, citar y presentar textos académicos." },
  "/organizacion-y-estudio": { title: "Organización y técnicas de estudio | Útiles Online", description: "Horarios, tareas y técnica Pomodoro para organizar mejor el estudio." },
  "/recursos-para-docentes": { title: "Recursos gratuitos para docentes | Útiles Online", description: "Herramientas educativas listas para compartir y usar en clase." },
  "/guias": { title: "Guías prácticas para estudiantes | Útiles Online", description: "Explicaciones sobre notas, APA, horarios y técnicas de estudio." },
  "/guias/como-calcular-promedio-final": { title: "Cómo calcular el promedio final paso a paso | Útiles Online", description: "Aprende a calcular promedios simples y ponderados con fórmula y ejemplo." },
  "/guias/nota-necesaria-para-aprobar": { title: "Cómo calcular la nota necesaria para aprobar | Útiles Online", description: "Fórmula y calculadora para saber qué nota necesitas en la evaluación restante." },
  "/guias/como-citar-pagina-web-apa-7": { title: "Cómo citar una página web en APA 7 | Útiles Online", description: "Guía para crear una referencia web APA 7 con o sin autor y fecha." },
  "/guias/promedio-simple-vs-ponderado": { title: "Promedio simple vs. ponderado | Útiles Online", description: "Diferencias, fórmula y cuándo usar cada tipo de promedio." },
  "/guias/tecnica-pomodoro": { title: "Técnica Pomodoro para estudiar mejor | Útiles Online", description: "Cómo organizar ciclos de concentración y pausas con Pomodoro." },
  "/guias/organizar-horario-universitario": { title: "Cómo organizar un horario universitario | Útiles Online", description: "Pasos para combinar clases, estudio, entregas y descanso." },
  "/acerca-de": { title: "Acerca de Útiles Online", description: "Conoce el propósito y los principios de Útiles Online." },
  "/metodologia": { title: "Metodología editorial y de cálculo | Útiles Online", description: "Cómo revisamos las fórmulas, guías y herramientas de Útiles Online." },
  "/privacidad": { title: "Política de privacidad | Útiles Online", description: "Información sobre privacidad y tratamiento de datos en Útiles Online." },
  "/contacto": { title: "Contacto | Útiles Online", description: "Formas de contactar con el equipo de Útiles Online." },
  "/panel-seo": { title: "Panel de oportunidades SEO | Útiles Online", description: "Analiza exportaciones de Search Console de forma local.", noindex: true }
};
for (const [slug, page] of Object.entries(CONTENT)) {
  pages[`/${slug}`] = { title: `${page.title} | Útiles Online`, description: page.intro, type: slug.startsWith("guias/") ? "Article" : undefined };
}
for (const tool of EXTRA_TOOL_CATALOG) {
  pages[`/${tool.slug}`] = { title: `${tool.title} gratis | Útiles Online`, description: tool.short, type: "SoftwareApplication" };
}
app.disable("x-powered-by");
app.use((req, res, next) => req.hostname.toLowerCase() === "www.utilesonline.com" ? res.redirect(301, `${ORIGIN}${req.originalUrl}`) : next());
app.use(compression());
app.use((_req, res, next) => { res.setHeader("X-Content-Type-Options", "nosniff"); res.setHeader("X-Frame-Options", "SAMEORIGIN"); res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin"); res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()"); next(); });
app.get("/robots.txt", (_req, res) => res.type("text/plain").send(`User-agent: *\nAllow: /\nSitemap: ${ORIGIN}/sitemap.xml\n`));
app.get("/sitemap.xml", (_req, res) => {
  const urls = Object.entries(pages).filter(([, page]) => !page.noindex).map(([route, page]) => `<url><loc>${ORIGIN}${route}</loc><lastmod>2026-08-01</lastmod><changefreq>${route === "/" ? "weekly" : "monthly"}</changefreq><priority>${route === "/" ? "1.0" : page.type === "SoftwareApplication" ? "0.9" : "0.7"}</priority></url>`).join("");
  res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
});
app.get(["/producto/*", "/colegios/*", "/tiendas/*", "/lista-utiles/*", "/utiles/*"], (_req, res) => {
  res.status(410).type("html").send('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>Contenido retirado | Útiles Online</title></head><body><main><h1>Este contenido fue retirado</h1><p>Útiles Online ahora se concentra en herramientas académicas gratuitas para estudiantes y docentes.</p><a href="/">Explorar las herramientas actuales</a></main></body></html>');
});
const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath, { index: false, maxAge: "7d" }));
function render(pathname: string) {
  const meta = pages[pathname]; if (!meta) return null;
  const canonical = `${ORIGIN}${pathname}`;
  const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
  const content = CONTENT[pathname.replace(/^\//, "")];
  const extraTool = EXTRA_TOOL_CATALOG.find(tool => `/${tool.slug}` === pathname);
  const extraSeo = extraTool ? getToolSeoDetails(extraTool) : null;
  const mainSchema = meta.type === "SoftwareApplication"
    ? { "@type": "SoftwareApplication", name: meta.title.split(" | ")[0], description: meta.description, url: canonical, applicationCategory: "EducationalApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }
    : meta.type === "Article"
      ? { "@type": "Article", headline: meta.title.split(" | ")[0], description: meta.description, url: canonical, dateModified: "2026-07-28", inLanguage: "es" }
      : { "@type": "WebPage", name: meta.title, description: meta.description, url: canonical, inLanguage: "es" };
  const graph: Record<string, unknown>[] = [mainSchema, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Inicio", item: ORIGIN }, { "@type": "ListItem", position: 2, name: meta.title.split(" | ")[0], item: canonical }] }];
  if (extraSeo) {
    graph.push({ "@type": "HowTo", name: `Cómo usar ${extraTool!.title}`, description: extraSeo.purpose, step: extraSeo.steps.map((text, index) => ({ "@type": "HowToStep", position: index + 1, text })) });
    graph.push({ "@type": "FAQPage", mainEntity: extraSeo.faqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) });
  }
  const schema = { "@context": "https://schema.org", "@graph": graph };
  const extraSections = extraSeo ? `<section><h2>¿Para qué sirve esta herramienta?</h2><p>${escapeHtml(extraSeo.purpose)}</p></section><section><h2>Cómo usarla paso a paso</h2><ol>${extraSeo.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol></section><section><h2>Consejos para un resultado fiable</h2><ul>${extraSeo.tips.map(tip => `<li>${escapeHtml(tip)}</li>`).join("")}</ul></section><section><h2>Preguntas frecuentes</h2>${extraSeo.faqs.map(faq => `<h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p>`).join("")}</section>` : "";
  const sections = content?.sections.map(section => `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.text)}</p></section>`).join("") || extraSections || `<section><h2>Cómo utilizar este recurso</h2><p>Introduce tus datos en la herramienta, revisa el resultado y consulta la explicación del método antes de tomar una decisión académica.</p></section>`;
  const homepageTools = ["calculadora-de-notas", "calculadora-regla-de-tres", "media-mediana-moda", "calculadora-areas-perimetros", "calculadora-volumenes", "calculadora-dias-entre-fechas", "contador-de-palabras", "generador-hojas-ejercicios"];
  const relatedSlugs = content?.tools || (extraTool ? EXTRA_TOOL_CATALOG.filter(tool => tool.slug !== extraTool.slug && tool.category === extraTool.category).slice(0, 4).map(tool => tool.slug) : pathname === "/" ? homepageTools : []);
  const related = relatedSlugs.map(slug => `<li><a href="/${escapeHtml(slug)}">${escapeHtml(pages[`/${slug}`]?.title.split(" | ")[0] || slug)}</a></li>`).join("");
  const educationalContext = meta.type === "SoftwareApplication" ? `<section><h2>Cómo obtener un resultado fiable</h2><p>Introduce únicamente datos que conozcas y revisa las unidades, porcentajes o escalas antes de calcular. La herramienta procesa la información en tu navegador y muestra el procedimiento para que puedas comprobarlo. Si el resultado se utilizará en una evaluación, confirma también las reglas de tu centro educativo.</p></section><section><h2>Qué incluye esta herramienta</h2><p>El recurso resuelve una tarea académica concreta sin registro obligatorio. Incluye instrucciones, resultado inmediato, explicación del método y enlaces relacionados. No sustituye las indicaciones de un profesor, una rúbrica oficial ni el reglamento de una universidad.</p></section>` : `<section><h2>Cómo usar este contenido</h2><p>Lee la explicación completa, aplica el ejemplo a tus propios datos y abre las herramientas relacionadas cuando necesites comprobar un cálculo. Las guías se revisan para mantener fórmulas, conceptos y pasos comprensibles.</p></section>`;
  const trustContext = `<section><h2>Metodología y privacidad</h2><p>Útiles Online prioriza fórmulas educativas verificables, ejemplos reproducibles y lenguaje claro. Los textos introducidos se procesan localmente cuando la función lo permite. No presentes un resultado automático como trabajo propio sin revisarlo y citar las fuentes exigidas por tu institución.</p></section><section><h2>Preguntas frecuentes</h2><h3>¿La herramienta es gratuita?</h3><p>Sí. Puedes utilizarla desde el navegador sin crear una cuenta.</p><h3>¿Se guarda mi información?</h3><p>Las herramientas informan cuando usan almacenamiento local. No introduzcas datos personales sensibles.</p><h3>¿Puedo usar el resultado en una tarea?</h3><p>Úsalo como apoyo y comprueba siempre el procedimiento, la rúbrica y las normas académicas aplicables.</p></section>`;
  const fallback = `<main data-server-fallback><nav><a href="/">Útiles Online</a> · <a href="/calculadoras-academicas">Calculadoras</a> · <a href="/guias">Guías</a> · <a href="/metodologia">Metodología</a></nav><article><h1>${escapeHtml(meta.title.split(" | ")[0])}</h1><p>${escapeHtml(meta.description)}</p>${sections}${educationalContext}${trustContext}${related ? `<h2>Herramientas relacionadas</h2><ul>${related}</ul>` : ""}</article><p><a href="/#herramientas">Explorar herramientas educativas gratuitas</a></p></main>`;
  return fs.readFileSync(path.join(distPath, "index.html"), "utf8")
    .replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${meta.description}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${meta.title}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${meta.description}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta name="robots" content=".*?" \/>/, `<meta name="robots" content="${meta.noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large"}" />`)
    .replace('<div id="root"></div>', `<div id="root">${fallback}</div>`)
    .replace("</head>", `<script type="application/ld+json">${JSON.stringify(schema)}</script></head>`);
}
app.get("*", (req, res) => {
  const html = render(req.path.replace(/\/+$/, "") || "/");
  if (html) return res.status(200).type("html").send(html);
  return res.status(404).type("html").send('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>Página no encontrada | Útiles Online</title></head><body><main><h1>Página no encontrada</h1><p>La dirección solicitada no existe.</p><a href="/">Volver al inicio</a></main></body></html>');
});
app.listen(PORT, "0.0.0.0", () => console.log(`Útiles Online running on port ${PORT}`));
