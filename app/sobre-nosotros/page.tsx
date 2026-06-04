import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description: "Conoce el proposito de UtilesOnline y su enfoque en herramientas rapidas y utiles.",
  alternates: { canonical: absoluteUrl("/sobre-nosotros") }
};

export default function AboutPage() {
  return (
    <StaticPage title="Sobre nosotros">
      <p>
        UtilesOnline es una plataforma de herramientas online simples, rapidas y accesibles para resolver tareas frecuentes desde el navegador.
      </p>
      <p>
        Nuestro enfoque es ofrecer utilidades claras, buen rendimiento movil y contenido facil de entender.
      </p>
    </StaticPage>
  );
}
