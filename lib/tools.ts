export type ToolCategory =
  | "pdf"
  | "imagenes"
  | "generadores"
  | "texto"
  | "calculadoras";

export type ToolKind =
  | "word-counter"
  | "case-converter"
  | "percentage"
  | "vat"
  | "age"
  | "password"
  | "unit-converter"
  | "timer"
  | "stopwatch"
  | "qr"
  | "apa"
  | "summary"
  | "hashtags"
  | "api-placeholder";

export type Tool = {
  slug: string;
  name: string;
  category: ToolCategory;
  description: string;
  title: string;
  metaDescription: string;
  h1: string;
  kind: ToolKind;
  related: string[];
  keywords: string[];
  faqs: { question: string; answer: string }[];
};

export const categories: Record<
  ToolCategory,
  { name: string; slug: string; description: string }
> = {
  pdf: {
    name: "PDF y documentos",
    slug: "pdf",
    description:
      "Convierte, comprime, une y organiza documentos PDF con interfaces simples preparadas para crecer."
  },
  imagenes: {
    name: "Imágenes",
    slug: "imagenes",
    description:
      "Cambia formatos, reduce peso y redimensiona imágenes para web, redes sociales y trabajo diario."
  },
  generadores: {
    name: "Generadores",
    slug: "generadores",
    description:
      "Crea códigos QR, hashtags, ideas para redes sociales y contenido práctico en segundos."
  },
  texto: {
    name: "Texto y escritura",
    slug: "texto",
    description:
      "Cuenta palabras, transforma textos, resume ideas y prepara referencias con herramientas ligeras."
  },
  calculadoras: {
    name: "Calculadoras",
    slug: "calculadoras",
    description:
      "Resuelve cálculos cotidianos como porcentajes y edad exacta desde móvil o escritorio."
  }
};

const commonFaq = (name: string) => [
  {
    question: `¿La herramienta ${name} es gratis?`,
    answer:
      "Sí. La herramienta está pensada para usarse gratis desde el navegador, sin pasos innecesarios ni barreras artificiales."
  },
  {
    question: "¿Funciona en el móvil?",
    answer:
      "Sí. La interfaz está diseñada mobile first para que puedas usarla cómodamente en teléfonos, tablets y computadores."
  },
  {
    question: "¿Necesito instalar algo?",
    answer:
      "No. Puedes abrir la página en tu navegador y usar la herramienta online. Las funciones avanzadas se conectarán mediante API routes del propio proyecto."
  }
];

export const tools: Tool[] = [
  {
    slug: "word-a-pdf",
    name: "Word a PDF",
    category: "pdf",
    description: "Convierte documentos Word en PDF manteniendo una experiencia clara y preparada para procesamiento seguro.",
    title: "Word a PDF online gratis | Convertidor rápido",
    metaDescription: "Convierte Word a PDF online con una herramienta rápida, clara y optimizada para móvil. Base preparada para conversión por API.",
    h1: "Convertir Word a PDF online",
    kind: "api-placeholder",
    related: ["pdf-a-word", "comprimir-pdf", "unir-pdf"],
    keywords: ["word a pdf", "convertir docx a pdf", "documentos online"],
    faqs: commonFaq("Word a PDF")
  },
  {
    slug: "pdf-a-word",
    name: "PDF a Word",
    category: "pdf",
    description: "Prepara conversiones de PDF a documentos editables con una interfaz ordenada y escalable.",
    title: "PDF a Word online gratis | Convertidor editable",
    metaDescription: "Convierte PDF a Word online con una página SEO preparada, rápida y lista para integrar procesamiento de archivos.",
    h1: "Convertir PDF a Word online",
    kind: "api-placeholder",
    related: ["word-a-pdf", "dividir-pdf", "comprimir-pdf"],
    keywords: ["pdf a word", "convertir pdf", "documento editable"],
    faqs: commonFaq("PDF a Word")
  },
  {
    slug: "comprimir-pdf",
    name: "Comprimir PDF",
    category: "pdf",
    description: "Reduce el tamaño de archivos PDF para enviarlos por correo, formularios o plataformas digitales.",
    title: "Comprimir PDF online gratis | Reducir tamaño de PDF",
    metaDescription: "Comprime PDF online de forma sencilla. Página optimizada para SEO, móvil y preparada para API de compresión.",
    h1: "Comprimir PDF online",
    kind: "api-placeholder",
    related: ["unir-pdf", "dividir-pdf", "word-a-pdf"],
    keywords: ["comprimir pdf", "reducir pdf", "pdf liviano"],
    faqs: commonFaq("Comprimir PDF")
  },
  {
    slug: "unir-pdf",
    name: "Unir PDF",
    category: "pdf",
    description: "Combina varios documentos PDF en un solo archivo usando una arquitectura lista para backend.",
    title: "Unir PDF online gratis | Combinar archivos PDF",
    metaDescription: "Une varios PDF en un solo documento con una herramienta clara, rápida y preparada para procesamiento en API routes.",
    h1: "Unir PDF online",
    kind: "api-placeholder",
    related: ["dividir-pdf", "comprimir-pdf", "pdf-a-word"],
    keywords: ["unir pdf", "combinar pdf", "juntar pdf"],
    faqs: commonFaq("Unir PDF")
  },
  {
    slug: "dividir-pdf",
    name: "Dividir PDF",
    category: "pdf",
    description: "Separa páginas de un PDF con una interfaz preparada para elegir rangos y descargar resultados.",
    title: "Dividir PDF online gratis | Separar páginas de PDF",
    metaDescription: "Divide PDF online por páginas o rangos. Base profesional lista para integrar separación de documentos por API.",
    h1: "Dividir PDF online",
    kind: "api-placeholder",
    related: ["unir-pdf", "comprimir-pdf", "pdf-a-word"],
    keywords: ["dividir pdf", "separar pdf", "extraer paginas pdf"],
    faqs: commonFaq("Dividir PDF")
  },
  {
    slug: "jpg-a-png",
    name: "JPG a PNG",
    category: "imagenes",
    description: "Cambia imágenes JPG a PNG con una estructura preparada para conversión y descarga optimizada.",
    title: "JPG a PNG online gratis | Convertidor de imágenes",
    metaDescription: "Convierte JPG a PNG online desde una página rápida y responsive, preparada para procesamiento de imágenes.",
    h1: "Convertir JPG a PNG online",
    kind: "api-placeholder",
    related: ["png-a-jpg", "webp-a-jpg", "comprimir-imagen"],
    keywords: ["jpg a png", "convertir imagen", "png online"],
    faqs: commonFaq("JPG a PNG")
  },
  {
    slug: "png-a-jpg",
    name: "PNG a JPG",
    category: "imagenes",
    description: "Convierte PNG a JPG cuando necesitas archivos ligeros para web, correo o redes.",
    title: "PNG a JPG online gratis | Convertir imágenes rápido",
    metaDescription: "Convierte PNG a JPG online con una interfaz simple, móvil y lista para integrar conversión real.",
    h1: "Convertir PNG a JPG online",
    kind: "api-placeholder",
    related: ["jpg-a-png", "webp-a-jpg", "redimensionar-imagen"],
    keywords: ["png a jpg", "convertidor jpg", "imagen online"],
    faqs: commonFaq("PNG a JPG")
  },
  {
    slug: "webp-a-jpg",
    name: "WEBP a JPG",
    category: "imagenes",
    description: "Transforma imágenes WEBP a JPG para compatibilidad con plataformas y aplicaciones.",
    title: "WEBP a JPG online gratis | Convertidor WEBP",
    metaDescription: "Convierte WEBP a JPG online con una base rápida, accesible y preparada para procesamiento de archivos.",
    h1: "Convertir WEBP a JPG online",
    kind: "api-placeholder",
    related: ["jpg-a-png", "png-a-jpg", "comprimir-imagen"],
    keywords: ["webp a jpg", "convertir webp", "imagen jpg"],
    faqs: commonFaq("WEBP a JPG")
  },
  {
    slug: "comprimir-imagen",
    name: "Comprimir imagen",
    category: "imagenes",
    description: "Reduce el peso de imágenes para mejorar tiempos de carga, SEO y envío por formularios.",
    title: "Comprimir imagen online gratis | Reducir JPG PNG WEBP",
    metaDescription: "Comprime imágenes online con una página preparada para API, buen rendimiento móvil y Core Web Vitals.",
    h1: "Comprimir imagen online",
    kind: "api-placeholder",
    related: ["redimensionar-imagen", "jpg-a-png", "png-a-jpg"],
    keywords: ["comprimir imagen", "reducir imagen", "optimizar imagen"],
    faqs: commonFaq("Comprimir imagen")
  },
  {
    slug: "redimensionar-imagen",
    name: "Redimensionar imagen",
    category: "imagenes",
    description: "Ajusta ancho y alto de imágenes para publicaciones, miniaturas, tiendas y documentos.",
    title: "Redimensionar imagen online gratis | Cambiar tamaño",
    metaDescription: "Redimensiona imágenes online desde una interfaz moderna lista para integrar edición real con API routes.",
    h1: "Redimensionar imagen online",
    kind: "api-placeholder",
    related: ["comprimir-imagen", "jpg-a-png", "webp-a-jpg"],
    keywords: ["redimensionar imagen", "cambiar tamaño imagen", "resize image"],
    faqs: commonFaq("Redimensionar imagen")
  },
  {
    slug: "generador-qr",
    name: "Generador de QR",
    category: "generadores",
    description: "Crea códigos QR para enlaces, textos, contactos o campañas desde el navegador.",
    title: "Generador de QR online gratis | Crear código QR",
    metaDescription: "Genera códigos QR online gratis para enlaces y textos. Herramienta funcional, rápida y responsive.",
    h1: "Generador de código QR online",
    kind: "qr",
    related: ["generador-hashtags", "contador-palabras", "generador-contrasenas"],
    keywords: ["generador qr", "codigo qr gratis", "crear qr"],
    faqs: commonFaq("Generador de QR")
  },
  {
    slug: "contador-palabras",
    name: "Contador de palabras",
    category: "texto",
    description: "Cuenta palabras, caracteres, frases y tiempo de lectura para textos académicos, SEO y redes.",
    title: "Contador de palabras online gratis | Caracteres y lectura",
    metaDescription: "Cuenta palabras y caracteres online en tiempo real. Ideal para SEO, trabajos, publicaciones y textos largos.",
    h1: "Contador de palabras online",
    kind: "word-counter",
    related: ["convertidor-mayusculas-minusculas", "resumidor-texto", "generador-referencias-apa"],
    keywords: ["contador de palabras", "contar caracteres", "texto online"],
    faqs: commonFaq("Contador de palabras")
  },
  {
    slug: "convertidor-mayusculas-minusculas",
    name: "Convertidor de mayúsculas y minúsculas",
    category: "texto",
    description: "Transforma texto a mayúsculas, minúsculas, título o formato oración en un clic.",
    title: "Convertidor de mayúsculas y minúsculas online",
    metaDescription: "Convierte texto a mayúsculas, minúsculas, título o frase. Herramienta gratis y funcional en el navegador.",
    h1: "Convertidor de mayúsculas y minúsculas",
    kind: "case-converter",
    related: ["contador-palabras", "resumidor-texto", "generador-hashtags"],
    keywords: ["mayusculas minusculas", "convertir texto", "formato texto"],
    faqs: commonFaq("Convertidor de texto")
  },
  {
    slug: "generador-referencias-apa",
    name: "Generador de referencias APA",
    category: "texto",
    description: "Crea una referencia APA básica para libros, artículos o páginas web.",
    title: "Generador de referencias APA online gratis",
    metaDescription: "Genera referencias APA básicas online para trabajos académicos, fuentes web, libros y artículos.",
    h1: "Generador de referencias APA",
    kind: "apa",
    related: ["contador-palabras", "resumidor-texto", "convertidor-mayusculas-minusculas"],
    keywords: ["referencias apa", "citas apa", "formato apa"],
    faqs: commonFaq("Generador de referencias APA")
  },
  {
    slug: "resumidor-texto",
    name: "Resumidor de texto",
    category: "texto",
    description: "Obtén un resumen extractivo básico para estudiar, revisar ideas o preparar contenido.",
    title: "Resumidor de texto online gratis | Resumir textos",
    metaDescription: "Resume textos online con una herramienta rápida preparada para mejorar con IA o reglas avanzadas.",
    h1: "Resumidor de texto online",
    kind: "summary",
    related: ["contador-palabras", "generador-referencias-apa", "convertidor-mayusculas-minusculas"],
    keywords: ["resumidor texto", "resumir online", "resumen gratis"],
    faqs: commonFaq("Resumidor de texto")
  },
  {
    slug: "generador-hashtags",
    name: "Generador de hashtags",
    category: "generadores",
    description: "Genera hashtags limpios para Instagram, TikTok, YouTube Shorts y publicaciones sociales.",
    title: "Generador de hashtags online gratis",
    metaDescription: "Crea hashtags online para redes sociales a partir de un tema o palabras clave. Rápido y móvil.",
    h1: "Generador de hashtags",
    kind: "hashtags",
    related: ["generador-qr", "generador-contrasenas", "contador-palabras"],
    keywords: ["hashtags", "generar hashtags", "hashtags instagram"],
    faqs: commonFaq("Generador de hashtags")
  },
  {
    slug: "calculadora-porcentaje",
    name: "Calculadora de porcentaje",
    category: "calculadoras",
    description: "Calcula porcentajes, descuentos, incrementos y proporciones frecuentes.",
    title: "Calculadora de porcentaje online gratis",
    metaDescription: "Calcula porcentajes online: porcentaje de un número, descuentos e incrementos de forma rápida.",
    h1: "Calculadora de porcentaje",
    kind: "percentage",
    related: ["calculadora-edad", "contador-palabras", "generador-qr"],
    keywords: ["calculadora porcentaje", "calcular porcentaje", "descuento porcentaje"],
    faqs: commonFaq("Calculadora de porcentaje")
  },
  {
    slug: "calculadora-edad",
    name: "Calculadora de edad",
    category: "calculadoras",
    description: "Calcula edad exacta por años, meses y días a partir de una fecha de nacimiento.",
    title: "Calculadora de edad online gratis | Edad exacta",
    metaDescription: "Calcula tu edad exacta online por años, meses y días. Herramienta simple, rápida y responsive.",
    h1: "Calculadora de edad",
    kind: "age",
    related: ["calculadora-porcentaje", "contador-palabras", "generador-qr"],
    keywords: ["calculadora edad", "edad exacta", "calcular edad"],
    faqs: commonFaq("Calculadora de edad")
  },
  {
    slug: "generador-contrasenas",
    name: "Generador de contraseñas",
    category: "generadores",
    description: "Crea contraseñas seguras con longitud configurable, números, símbolos y letras.",
    title: "Generador de contraseñas seguras online gratis",
    metaDescription: "Genera contraseñas seguras online con letras, números y símbolos. Herramienta rápida, privada y responsive.",
    h1: "Generador de contraseñas seguras",
    kind: "password",
    related: ["generador-qr", "contador-palabras", "generador-hashtags"],
    keywords: ["generador contraseñas", "password generator", "contraseña segura"],
    faqs: commonFaq("Generador de contraseñas")
  },
  {
    slug: "calculadora-iva",
    name: "Calculadora de IVA",
    category: "calculadoras",
    description: "Calcula IVA incluido, IVA a agregar y precio final para facturas, compras y presupuestos.",
    title: "Calculadora de IVA online gratis | Precio con IVA",
    metaDescription: "Calcula IVA online, precio final e importe sin impuesto. Herramienta útil para compras, facturas y presupuestos.",
    h1: "Calculadora de IVA online",
    kind: "vat",
    related: ["calculadora-porcentaje", "calculadora-edad", "contador-palabras"],
    keywords: ["calculadora iva", "calcular iva", "precio con iva"],
    faqs: commonFaq("Calculadora de IVA")
  },
  {
    slug: "convertidor-unidades",
    name: "Convertidor de unidades",
    category: "calculadoras",
    description: "Convierte medidas frecuentes de longitud, peso y temperatura desde una interfaz simple.",
    title: "Convertidor de unidades online gratis",
    metaDescription: "Convierte unidades online: metros, kilómetros, libras, kilogramos, Celsius y Fahrenheit.",
    h1: "Convertidor de unidades online",
    kind: "unit-converter",
    related: ["calculadora-porcentaje", "calculadora-iva", "calculadora-edad"],
    keywords: ["convertidor unidades", "convertir medidas", "metros a kilometros"],
    faqs: commonFaq("Convertidor de unidades")
  },
  {
    slug: "temporizador-online",
    name: "Temporizador online",
    category: "calculadoras",
    description: "Configura una cuenta regresiva para estudiar, cocinar, trabajar por bloques o entrenar.",
    title: "Temporizador online gratis | Cuenta regresiva",
    metaDescription: "Usa un temporizador online gratis con minutos y segundos. Ideal para estudio, cocina y productividad.",
    h1: "Temporizador online",
    kind: "timer",
    related: ["cronometro-online", "calculadora-edad", "contador-palabras"],
    keywords: ["temporizador online", "cuenta regresiva", "timer online"],
    faqs: commonFaq("Temporizador online")
  },
  {
    slug: "cronometro-online",
    name: "Cronómetro online",
    category: "calculadoras",
    description: "Mide tiempo transcurrido con iniciar, pausar y reiniciar desde cualquier dispositivo.",
    title: "Cronómetro online gratis | Medir tiempo",
    metaDescription: "Cronómetro online gratis para medir tiempo en clases, rutinas, trabajo o ejercicios.",
    h1: "Cronómetro online",
    kind: "stopwatch",
    related: ["temporizador-online", "calculadora-porcentaje", "contador-palabras"],
    keywords: ["cronometro online", "medir tiempo", "stopwatch"],
    faqs: commonFaq("Cronómetro online")
  }
];

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: ToolCategory) {
  return tools.filter((tool) => tool.category === category);
}

export function getRelatedTools(tool: Tool) {
  return tool.related
    .map((slug) => getTool(slug))
    .filter((relatedTool): relatedTool is Tool => Boolean(relatedTool));
}
