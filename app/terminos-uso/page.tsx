import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Términos de uso",
  description: "Condiciones generales para utilizar las herramientas y contenidos de UtilesOnline.",
  alternates: { canonical: absoluteUrl("/terminos-uso") }
};

export default function TermsPage() {
  return (
    <StaticPage title="Términos de uso">
      <p>
        UtilesOnline ofrece herramientas y contenidos informativos de uso general. El usuario es responsable de revisar los resultados antes de utilizarlos en contextos legales, académicos, comerciales o profesionales.
      </p>
      <p>
        El sitio puede cambiar, ampliar o retirar funciones para mejorar seguridad, rendimiento o calidad. No se permite usar la plataforma para actividades abusivas, ilegales o que afecten la disponibilidad del servicio.
      </p>
    </StaticPage>
  );
}
