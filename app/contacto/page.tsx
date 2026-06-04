import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta con UtilesOnline para sugerencias, mejoras, reportes o consultas generales.",
  alternates: { canonical: absoluteUrl("/contacto") }
};

export default function ContactPage() {
  return (
    <StaticPage title="Contacto">
      <p>
        Para consultas sobre herramientas, mejoras o reportes de funcionamiento, escribe a contacto@utilesonline.com.
      </p>
    </StaticPage>
  );
}
