import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Información sobre privacidad, datos y uso responsable de UtilesOnline.",
  alternates: { canonical: absoluteUrl("/politica-privacidad") }
};

export default function PrivacyPage() {
  return (
    <StaticPage title="Política de privacidad">
      <p>
        Esta política describe de forma general cómo UtilesOnline puede tratar información técnica necesaria para operar el sitio, mejorar la experiencia y medir rendimiento.
      </p>
      <p>
        Cuando se integren servicios como Google AdSense, analítica o formularios, esta página debe actualizarse con los proveedores, finalidades, bases legales y opciones de gestión correspondientes.
      </p>
      <p>
        No se deben solicitar datos personales innecesarios para usar herramientas básicas. Las funciones con archivos deben diseñarse con transparencia sobre procesamiento, almacenamiento y eliminación.
      </p>
    </StaticPage>
  );
}
