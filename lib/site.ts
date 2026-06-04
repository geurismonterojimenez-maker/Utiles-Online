export const siteConfig = {
  name: "UtilesOnline",
  tagline: "Herramientas online gratis para tareas diarias",
  description:
    "UtilesOnline reúne herramientas rápidas para convertir documentos, editar imágenes, generar contenido, calcular datos y resolver tareas frecuentes desde cualquier dispositivo.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://utilesonline.com",
  locale: "es_ES",
  twitter: "@utilesonline"
};

export function absoluteUrl(path = "") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${cleanPath}`;
}
