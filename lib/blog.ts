export const posts = [
  {
    slug: "como-elegir-herramientas-online-seguras",
    title: "Cómo elegir herramientas online seguras y rápidas",
    description:
      "Criterios prácticos para usar herramientas online sin perder tiempo, privacidad ni rendimiento.",
    date: "2026-05-26"
  },
  {
    slug: "optimizar-imagenes-para-web",
    title: "Cómo optimizar imágenes para una web más rápida",
    description:
      "Consejos básicos para reducir peso, elegir formatos y mejorar la carga móvil.",
    date: "2026-05-26"
  },
  {
    slug: "por-que-usar-sitemap-en-web-de-herramientas",
    title: "Por qué un sitemap ayuda a una web de herramientas",
    description:
      "Cómo un sitemap bien mantenido facilita el rastreo de herramientas, categorías, guías y artículos.",
    date: "2026-05-27"
  },
  {
    slug: "como-evitar-clics-accidentales-en-adsense",
    title: "Cómo evitar clics accidentales en AdSense",
    description:
      "Buenas prácticas de diseño para monetizar sin confundir al usuario ni poner anuncios junto a acciones críticas.",
    date: "2026-05-27"
  },
  {
    slug: "ideas-de-herramientas-online-con-trafico-seo",
    title: "Ideas de herramientas online con tráfico SEO",
    description:
      "Tipos de utilidades buscadas a diario que pueden crecer con contenido long-tail y enlaces internos.",
    date: "2026-05-27"
  }
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
