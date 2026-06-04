import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { categories, tools } from "@/lib/tools";
import { posts } from "@/lib/blog";
import { seoPages } from "@/lib/seo-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/blog",
    "/guias",
    "/sobre-nosotros",
    "/contacto",
    "/politica-privacidad",
    "/terminos-uso",
    "/politica-cookies"
  ];

  return [
    ...staticRoutes.map((route) => ({ url: absoluteUrl(route), changeFrequency: "weekly" as const, priority: route ? 0.7 : 1 })),
    ...Object.values(categories).map((category) => ({ url: absoluteUrl(`/categorias/${category.slug}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...tools.map((tool) => ({ url: absoluteUrl(`/${tool.slug}`), changeFrequency: "weekly" as const, priority: 0.9 })),
    ...posts.map((post) => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: post.date, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...seoPages.map((page) => ({ url: absoluteUrl(`/guias/${page.slug}`), changeFrequency: "monthly" as const, priority: 0.75 }))
  ];
}
