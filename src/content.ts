export type ContentPageData = {
  title: string;
  intro: string;
  sections: { heading: string; text: string }[];
  tools?: string[];
  category?: string;
};

export const CONTENT: Record<string, ContentPageData> = {
  "calculadoras-academicas": {
    title: "Calculadoras académicas gratuitas",
    intro: "Calcula promedios, metas, GPA y asistencia con resultados explicados paso a paso.",
    tools: ["calculadora-de-notas", "nota-necesaria-para-aprobar", "calculadora-gpa", "conversor-de-calificaciones", "calculadora-de-asistencia"],
    sections: [
      { heading: "Elige la calculadora adecuada", text: "Usa el promedio ponderado cuando cada actividad tenga un peso distinto; el GPA para créditos universitarios; y la calculadora de asistencia para comprobar requisitos mínimos." },
      { heading: "Resultados para tomar decisiones", text: "Cada resultado es una estimación basada en los datos que introduces. Contrástalo con el reglamento y la escala oficial de tu institución." }
    ]
  },
  "herramientas-de-escritura": {
    title: "Herramientas de escritura académica",
    intro: "Cuenta, limpia, organiza y cita textos sin enviar su contenido a nuestros servidores.",
    tools: ["contador-de-palabras", "generador-apa", "generador-de-portadas", "limpiador-de-texto"],
    sections: [{ heading: "Mejora la presentación", text: "Antes de entregar, revisa extensión, ortografía, estructura, citas y formato. Estas herramientas resuelven la parte mecánica para que concentres tu tiempo en las ideas." }]
  },
  "organizacion-y-estudio": {
    title: "Organización y técnicas de estudio",
    intro: "Convierte fechas, clases y sesiones de concentración en un plan semanal realista.",
    tools: ["temporizador-pomodoro", "creador-de-horarios", "planificador-de-tareas"],
    sections: [{ heading: "Planificar sin saturarse", text: "Empieza por fechas fijas, divide proyectos grandes en tareas pequeñas y reserva pausas. Un horario útil también deja espacio para cambios." }]
  },
  "recursos-para-docentes": {
    title: "Recursos gratuitos para docentes",
    intro: "Herramientas listas para proyectar, compartir o usar durante la preparación de clases.",
    tools: ["calculadora-de-notas", "creador-de-horarios", "generador-apa", "contador-de-palabras"],
    sections: [{ heading: "Uso responsable en el aula", text: "Comparte el enlace directo de cada herramienta y explica el método detrás del resultado. Así el recurso apoya el aprendizaje en vez de sustituirlo." }]
  },
  "guias": {
    title: "Guías para estudiar mejor",
    intro: "Explicaciones claras y ejemplos prácticos para resolver dudas académicas frecuentes.",
    sections: [
      { heading: "Cálculo académico", text: "Aprende a diferenciar promedio simple y ponderado, estimar la nota final y convertir escalas sin perder proporcionalidad." },
      { heading: "Escritura y organización", text: "Consulta cómo citar en APA 7, organizar un horario y usar Pomodoro de forma sostenible." }
    ]
  },
  "guias/como-calcular-promedio-final": {
    title: "Cómo calcular el promedio final paso a paso",
    intro: "El promedio final puede ser simple o ponderado. La diferencia está en cuánto vale cada evaluación.",
    category: "Notas",
    sections: [
      { heading: "Promedio simple", text: "Suma todas las notas y divide entre la cantidad de notas. Úsalo solamente cuando todas tengan el mismo valor." },
      { heading: "Promedio ponderado", text: "Multiplica cada nota por su porcentaje, suma los productos y divide entre el total de pesos. Comprueba que los porcentajes sumen 100." },
      { heading: "Ejemplo", text: "Si tareas valen 30%, parcial 30% y proyecto 40%, notas de 85, 78 y 92 dan 85.7 puntos." }
    ],
    tools: ["calculadora-de-notas", "nota-necesaria-para-aprobar"]
  },
  "guias/nota-necesaria-para-aprobar": {
    title: "Cómo saber qué nota necesitas para aprobar",
    intro: "Calcula la nota necesaria usando tu promedio actual, el porcentaje completado y la meta.",
    category: "Notas",
    sections: [
      { heading: "La fórmula", text: "Resta del objetivo total los puntos ya obtenidos y divide entre el porcentaje pendiente." },
      { heading: "Metas imposibles", text: "Si el resultado supera la escala máxima, la meta no es alcanzable con una sola evaluación. Prueba un objetivo diferente o consulta opciones de recuperación." }
    ],
    tools: ["nota-necesaria-para-aprobar", "calculadora-de-notas"]
  },
  "guias/como-citar-pagina-web-apa-7": {
    title: "Cómo citar una página web en APA 7",
    intro: "Una referencia web suele incluir autor, fecha, título, sitio y URL.",
    category: "Escritura",
    sections: [
      { heading: "Sin autor o sin fecha", text: "Si no hay autor, comienza por el título. Si no aparece una fecha verificable, usa la abreviatura s. f. No inventes información." },
      { heading: "Revisión final", text: "Comprueba que el enlace funcione, aplica sangría francesa en la bibliografía y conserva el orden alfabético." }
    ],
    tools: ["generador-apa", "contador-de-palabras"]
  },
  "guias/promedio-simple-vs-ponderado": {
    title: "Promedio simple vs. ponderado",
    intro: "El promedio simple trata todas las notas por igual; el ponderado respeta el valor de cada actividad.",
    category: "Notas",
    sections: [
      { heading: "Cuándo usar cada uno", text: "Usa el simple para actividades equivalentes. Usa el ponderado cuando el programa indica porcentajes distintos para tareas, exámenes o proyectos." },
      { heading: "Error habitual", text: "No dividas entre la cantidad de evaluaciones cuando sus porcentajes son diferentes. Ese cálculo cambia el peso real de cada nota." }
    ],
    tools: ["calculadora-de-notas"]
  },
  "guias/tecnica-pomodoro": {
    title: "Técnica Pomodoro: guía práctica",
    intro: "Pomodoro alterna periodos de concentración con pausas breves para reducir la fatiga.",
    category: "Estudio",
    sections: [
      { heading: "Un ciclo sostenible", text: "Trabaja 25 minutos, descansa 5 y repite. Después de cuatro ciclos, toma una pausa de 15 a 30 minutos." },
      { heading: "Cuándo ajustar el tiempo", text: "Una lectura compleja puede necesitar bloques de 40 o 50 minutos. Conserva siempre pausas reales y elimina notificaciones durante el bloque." }
    ],
    tools: ["temporizador-pomodoro", "planificador-de-tareas"]
  },
  "guias/organizar-horario-universitario": {
    title: "Cómo organizar un horario universitario",
    intro: "Un buen horario combina clases, traslados, estudio individual, entregas y descanso.",
    category: "Organización",
    sections: [
      { heading: "Orden recomendado", text: "Coloca primero las clases y compromisos fijos. Añade bloques de repaso cerca de cada clase y deja márgenes para imprevistos." },
      { heading: "Carga realista", text: "No ocupes cada espacio disponible. Reserva bloques libres para comidas, traslados y tareas inesperadas." }
    ],
    tools: ["creador-de-horarios", "planificador-de-tareas"]
  },
  "guias/como-calcular-gpa": {
    title: "Cómo calcular el GPA en escala 4.0",
    intro: "El GPA combina la calificación de cada materia con la cantidad de créditos cursados.",
    category: "Notas",
    sections: [
      { heading: "Conversión a puntos", text: "Convierte cada letra a puntos según la escala de tu universidad, multiplica por sus créditos y suma todos los productos." },
      { heading: "GPA acumulado", text: "Divide los puntos de calidad acumulados entre el total de créditos que cuentan para el promedio. Algunas instituciones excluyen materias repetidas." }
    ],
    tools: ["calculadora-gpa", "conversor-de-calificaciones"]
  },
  "guias/equivalencia-notas-escalas": {
    title: "Equivalencia entre escalas de calificaciones",
    intro: "Las escalas de 5, 10, 20 y 100 pueden compararse mediante su porcentaje proporcional.",
    category: "Notas",
    sections: [
      { heading: "Conversión proporcional", text: "Divide la nota entre el máximo de su escala y multiplica por el máximo de la escala nueva." },
      { heading: "Limitaciones", text: "Una equivalencia proporcional no sustituye las tablas oficiales de admisión, que pueden usar rangos, letras o criterios propios." }
    ],
    tools: ["conversor-de-calificaciones"]
  },
  "guias/como-calcular-porcentaje-asistencia": {
    title: "Cómo calcular el porcentaje de asistencia",
    intro: "La asistencia se obtiene dividiendo las clases asistidas entre las clases impartidas.",
    category: "Notas",
    sections: [
      { heading: "Fórmula", text: "Multiplica por 100 el resultado de clases asistidas dividido entre clases impartidas." },
      { heading: "Ausencias futuras", text: "Antes de faltar, calcula cómo cambiará el porcentaje después de las próximas clases y confirma el mínimo reglamentario." }
    ],
    tools: ["calculadora-de-asistencia"]
  },
  "guias/como-subir-promedio": {
    title: "Cómo subir tu promedio de forma realista",
    intro: "Mejorar el promedio exige priorizar actividades con mayor peso y metas matemáticamente alcanzables.",
    category: "Notas",
    sections: [
      { heading: "Prioriza por impacto", text: "Identifica las evaluaciones pendientes con mayor porcentaje. Una mejora pequeña en una actividad de gran peso produce más efecto." },
      { heading: "Crea escenarios", text: "Calcula resultados posibles con varias notas antes de fijar tu objetivo de estudio." }
    ],
    tools: ["calculadora-de-notas", "nota-necesaria-para-aprobar"]
  },
  "guias/referencias-apa-libro": {
    title: "Cómo citar un libro en APA 7",
    intro: "Una referencia de libro incluye autor, año, título en cursiva y editorial.",
    category: "Escritura",
    sections: [
      { heading: "Formato básico", text: "Apellido, inicial. (Año). Título del libro. Editorial. No se incluye la ciudad de publicación." },
      { heading: "Ediciones", text: "Indica la edición entre paréntesis después del título cuando no sea la primera." }
    ],
    tools: ["generador-apa"]
  },
  "guias/referencias-apa-articulo": {
    title: "Cómo citar un artículo científico en APA 7",
    intro: "Los artículos requieren autor, fecha, título, revista, volumen, número, páginas y DOI cuando exista.",
    category: "Escritura",
    sections: [
      { heading: "DOI y URL", text: "Presenta el DOI como enlace https://doi.org/. Si el artículo no tiene DOI y proviene de una base de datos académica, normalmente no se agrega la URL privada." },
      { heading: "Volumen y número", text: "El volumen se escribe en cursiva; el número va entre paréntesis y sin cursiva." }
    ],
    tools: ["generador-apa"]
  },
  "guias/cita-textual-y-parafrasis-apa": {
    title: "Cita textual y paráfrasis en APA 7",
    intro: "Una cita textual reproduce palabras exactas; una paráfrasis explica la idea con redacción propia.",
    category: "Escritura",
    sections: [
      { heading: "Cita textual", text: "Incluye autor, año y página. Las citas extensas se presentan en bloque según las normas de tu institución." },
      { heading: "Paráfrasis", text: "Aunque uses palabras propias, debes acreditar la fuente con autor y año." }
    ],
    tools: ["generador-apa", "contador-de-palabras"]
  },
  "guias/como-hacer-portada-trabajo": {
    title: "Cómo hacer la portada de un trabajo académico",
    intro: "La portada identifica institución, título, estudiante, asignatura, docente y fecha.",
    category: "Escritura",
    sections: [
      { heading: "Jerarquía visual", text: "Usa un título claro, espacios consistentes y una tipografía legible. Evita adornos que compitan con la información." },
      { heading: "Antes de entregar", text: "Comprueba nombres, fecha, sección y requisitos específicos del centro." }
    ],
    tools: ["generador-de-portadas"]
  },
  "guias/como-contar-palabras-ensayo": {
    title: "Cómo contar palabras en un ensayo",
    intro: "El conteo ayuda a cumplir límites y equilibrar introducción, desarrollo y conclusión.",
    category: "Escritura",
    sections: [
      { heading: "Qué suele contar", text: "Normalmente cuentan títulos y cuerpo del texto, pero bibliografía, anexos y notas pueden excluirse según la institución." },
      { heading: "Distribución orientativa", text: "Una introducción y conclusión breves dejan la mayor parte de las palabras para argumentar y presentar evidencia." }
    ],
    tools: ["contador-de-palabras", "limpiador-de-texto"]
  },
  "guias/limpiar-texto-copiado-pdf": {
    title: "Cómo limpiar texto copiado de un PDF",
    intro: "Los PDF suelen introducir saltos de línea, espacios repetidos y guiones no deseados.",
    category: "Escritura",
    sections: [
      { heading: "Limpieza inicial", text: "Normaliza espacios y párrafos antes de corregir ortografía. Conserva las separaciones que sí expresan una estructura." },
      { heading: "Revisión humana", text: "Comprueba fórmulas, citas, palabras partidas y caracteres especiales después de la limpieza automática." }
    ],
    tools: ["limpiador-de-texto", "contador-de-palabras"]
  },
  "guias/planificar-semana-estudio": {
    title: "Cómo planificar una semana de estudio",
    intro: "Una semana eficaz combina prioridades, tiempo disponible y descansos suficientes.",
    category: "Organización",
    sections: [
      { heading: "Plan semanal", text: "Registra fechas de entrega, divide proyectos grandes y asigna cada tarea a un bloque concreto." },
      { heading: "Revisión diaria", text: "Al terminar el día, mueve lo pendiente sin sobrecargar la jornada siguiente." }
    ],
    tools: ["planificador-de-tareas", "creador-de-horarios"]
  },
  "guias/organizar-tareas-por-prioridad": {
    title: "Cómo organizar tareas por prioridad",
    intro: "La prioridad depende de urgencia, impacto, duración y consecuencias de retrasar una tarea.",
    category: "Organización",
    sections: [
      { heading: "Primero lo importante", text: "Empieza por tareas cercanas y de alto impacto. Reserva bloques breves para pendientes rápidos y concretos." },
      { heading: "Evita listas interminables", text: "Define tres objetivos principales al día y mantén el resto como pendientes secundarios." }
    ],
    tools: ["planificador-de-tareas"]
  },
  "guias/horario-estudio-secundaria": {
    title: "Horario de estudio para secundaria",
    intro: "Un horario escolar debe respetar clases, tareas, actividad física, sueño y tiempo personal.",
    category: "Organización",
    sections: [
      { heading: "Bloques cortos", text: "Después de la jornada escolar funcionan mejor sesiones breves con objetivos específicos y pausas." },
      { heading: "Preparación de exámenes", text: "Distribuye el repaso durante varios días en vez de concentrarlo la noche anterior." }
    ],
    tools: ["creador-de-horarios", "temporizador-pomodoro"]
  },
  "guias/metodos-estudio-examen": {
    title: "Métodos de estudio para preparar un examen",
    intro: "Recordar mejora cuando recuperas la información activamente y distribuyes la práctica.",
    category: "Estudio",
    sections: [
      { heading: "Recuperación activa", text: "Cierra los apuntes e intenta explicar, resolver o escribir lo aprendido sin mirar." },
      { heading: "Práctica espaciada", text: "Programa repasos separados y aumenta gradualmente el intervalo cuando recuerdes con facilidad." }
    ],
    tools: ["temporizador-pomodoro", "planificador-de-tareas"]
  },
  "guias/evitar-distracciones-al-estudiar": {
    title: "Cómo evitar distracciones al estudiar",
    intro: "Reducir distracciones exige preparar el entorno antes de comenzar, no depender solo de voluntad.",
    category: "Estudio",
    sections: [
      { heading: "Prepara el bloque", text: "Define una tarea concreta, silencia notificaciones y deja a mano únicamente los materiales necesarios." },
      { heading: "Registra interrupciones", text: "Anota pensamientos o pendientes sin abandonar la sesión y atiéndelos durante la pausa." }
    ],
    tools: ["temporizador-pomodoro"]
  },
  "guias/descansos-efectivos-estudio": {
    title: "Cómo hacer descansos efectivos al estudiar",
    intro: "Una pausa útil reduce fatiga sin convertirse en una interrupción difícil de terminar.",
    category: "Estudio",
    sections: [
      { heading: "Pausas breves", text: "Levántate, hidrátate o mira a distancia. Evita contenido que te atrape durante más tiempo del planificado." },
      { heading: "Descanso largo", text: "Después de varios bloques, come, camina o cambia de actividad antes de retomar una tarea exigente." }
    ],
    tools: ["temporizador-pomodoro"]
  },
  "guias/calculadora-cientifica-operaciones": {
    title: "Operaciones básicas de una calculadora científica",
    intro: "Potencias, raíces, logaritmos y trigonometría resuelven relaciones frecuentes en matemáticas y ciencias.",
    category: "Matemáticas",
    sections: [
      { heading: "Ángulos", text: "Comprueba si la calculadora usa grados o radianes antes de calcular seno y coseno." },
      { heading: "Dominio", text: "Algunas operaciones no están definidas para todos los valores: el logaritmo real requiere un número positivo." }
    ],
    tools: ["calculadora-cientifica"]
  },
  "guias/convertir-unidades-sin-errores": {
    title: "Cómo convertir unidades sin errores",
    intro: "Una conversión correcta conserva la magnitud y cambia únicamente la unidad utilizada.",
    category: "Matemáticas",
    sections: [
      { heading: "Factor de conversión", text: "Multiplica por una fracción equivalente a uno, colocando la unidad original en la posición que permita cancelarla." },
      { heading: "Comprobación", text: "Verifica si el resultado debe ser mayor o menor según la relación entre ambas unidades." }
    ],
    tools: ["conversor-de-unidades"]
  }
};

export const GUIDE_SLUGS = Object.keys(CONTENT).filter(slug => slug.startsWith("guias/"));
