export type SeoPage = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intent: "comparativa" | "caso-de-uso";
  relatedTools: string[];
  sections: { title: string; body: string }[];
};

export const seoPages: SeoPage[] = [
  {
    slug: "mejores-herramientas-para-comprimir-pdf-gratis",
    title: "Mejores herramientas para comprimir PDF gratis",
    description: "Guía para elegir una herramienta de compresión PDF rápida, clara y segura.",
    h1: "Mejores herramientas para comprimir PDF gratis",
    intent: "comparativa",
    relatedTools: ["comprimir-pdf", "unir-pdf", "dividir-pdf"],
    sections: [
      {
        title: "Qué debe tener una buena herramienta para comprimir PDF",
        body: "Una buena herramienta para comprimir PDF debe ser fácil de usar, explicar sus límites, aceptar archivos comunes y evitar pantallas confusas. También debe separar claramente la publicidad de los botones de procesamiento y descarga."
      },
      {
        title: "Cuándo usar compresión PDF",
        body: "La compresión resulta útil cuando un formulario, correo o plataforma limita el tamaño del archivo. También ayuda a compartir documentos desde móvil sin consumir tantos datos."
      }
    ]
  },
  {
    slug: "redimensionar-imagen-para-instagram",
    title: "Redimensionar imagen para Instagram online",
    description: "Consejos y herramienta para ajustar imágenes antes de publicarlas en Instagram.",
    h1: "Redimensionar imagen para Instagram",
    intent: "caso-de-uso",
    relatedTools: ["redimensionar-imagen", "comprimir-imagen", "jpg-a-png"],
    sections: [
      {
        title: "Por qué ajustar el tamaño antes de publicar",
        body: "Redimensionar una imagen antes de subirla ayuda a controlar el encuadre, reducir peso y evitar recortes automáticos. Esto mejora la presentación visual y puede acelerar la carga en conexiones móviles."
      },
      {
        title: "Flujo recomendado",
        body: "Primero ajusta el tamaño, luego comprime la imagen y finalmente convierte el formato si una plataforma lo necesita. Mantener ese orden evita perder calidad de forma innecesaria."
      }
    ]
  },
  {
    slug: "comprimir-pdf-para-correo",
    title: "Comprimir PDF para enviar por correo",
    description: "Guía rápida para reducir PDF antes de enviarlos por email.",
    h1: "Comprimir PDF para correo electrónico",
    intent: "caso-de-uso",
    relatedTools: ["comprimir-pdf", "dividir-pdf", "unir-pdf"],
    sections: [
      {
        title: "Por qué el correo rechaza algunos PDF",
        body: "Muchos proveedores de correo limitan el tamaño de los adjuntos. Si un PDF incluye imágenes grandes o muchas páginas, puede superar ese límite y conviene reducirlo o dividirlo antes de enviarlo."
      },
      {
        title: "Buenas prácticas",
        body: "Elige nombres claros, revisa que el documento siga legible y evita enviar información sensible por canales no verificados. Si el archivo sigue siendo grande, divide las páginas necesarias."
      }
    ]
  },
  {
    slug: "mejores-herramientas-online-para-estudiantes",
    title: "Mejores herramientas online para estudiantes",
    description: "Selección de utilidades para resumir textos, contar palabras, generar referencias APA y calcular datos.",
    h1: "Mejores herramientas online para estudiantes",
    intent: "comparativa",
    relatedTools: ["contador-palabras", "resumidor-texto", "generador-referencias-apa", "calculadora-porcentaje"],
    sections: [
      {
        title: "Herramientas que ahorran tiempo",
        body: "Los estudiantes suelen necesitar contar palabras, preparar referencias, resumir lecturas y hacer cálculos rápidos. Tener esas utilidades en una sola plataforma reduce cambios de contexto."
      },
      {
        title: "Cómo usarlas con criterio",
        body: "Las herramientas ayudan a organizar el trabajo, pero siempre conviene revisar resultados, citar fuentes correctamente y evitar depender de resúmenes automáticos sin lectura propia."
      }
    ]
  }
];

export function getSeoPage(slug: string) {
  return seoPages.find((page) => page.slug === slug);
}
