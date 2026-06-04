import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Información sobre cookies, medición y publicidad en UtilesOnline.",
  alternates: { canonical: absoluteUrl("/politica-cookies") }
};

export default function CookiesPage() {
  return (
    <StaticPage title="Política de cookies">
      <p>
        UtilesOnline puede utilizar cookies técnicas para el funcionamiento del sitio y, cuando se habiliten, cookies de medición o publicidad asociadas a proveedores como Google.
      </p>
      <p>
        Antes de activar AdSense o analítica, conviene implementar un banner de consentimiento adecuado a los países objetivo y actualizar esta página con detalles de gestión y retiro del consentimiento.
      </p>
    </StaticPage>
  );
}
