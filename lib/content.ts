import { categories, getRelatedTools, type Tool } from "@/lib/tools";

export function buildToolArticle(tool: Tool) {
  const category = categories[tool.category];
  const related = getRelatedTools(tool);
  const relatedNames = related.map((item) => item.name).join(", ");

  return {
    intro: [
      `${tool.name} de UtilesOnline ayuda a resolver una tarea concreta desde el navegador, sin instalar programas ni pasar por pasos innecesarios. La herramienta esta pensada para cargar rapido, funcionar bien en movil y mantener la accion principal siempre clara.`,
      `Esta utilidad pertenece a ${category.name.toLowerCase()}, una categoria enfocada en tareas frecuentes como convertir archivos, editar imagenes, trabajar con texto, generar recursos o resolver calculos cotidianos.`
    ],
    body: [
      `Usar ${tool.name} es util cuando quieres ahorrar tiempo y mantener el control del resultado. La interfaz muestra solo los controles necesarios para completar la tarea y separa cualquier bloque publicitario de botones, formularios o zonas de descarga.`,
      `Cada pagina usa una URL limpia, un titulo claro, contenido explicativo, preguntas frecuentes y enlaces internos para que puedas encontrar herramientas complementarias sin perder el contexto.`,
      `La experiencia movil es prioritaria: los controles tienen buen tamano, el contenido se adapta a una sola columna y los anuncios laterales solo aparecen en pantallas grandes.`,
      relatedNames
        ? `Tambien puedes revisar herramientas relacionadas como ${relatedNames}.`
        : `La plataforma seguira incorporando utilidades relacionadas para cubrir mas tareas del dia a dia.`
    ],
    howTo: [
      `Abre la pagina de ${tool.name} desde el menu, la busqueda o una URL directa.`,
      "Lee la explicacion inicial para confirmar que corresponde a tu necesidad.",
      "Completa los campos, pega el texto o selecciona el archivo segun corresponda.",
      "Revisa el resultado antes de copiar, descargar o continuar.",
      "Usa las herramientas relacionadas si necesitas completar una tarea complementaria."
    ]
  };
}
