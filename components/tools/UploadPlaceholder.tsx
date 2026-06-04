"use client";

import { useMemo, useState } from "react";
import type { Tool } from "@/lib/tools";

type StatusType = "idle" | "loading" | "success" | "error";

type UploadCopy = {
  eyebrow: string;
  title: string;
  description: string;
  noteTitle: string;
  note: string;
  button: string;
};

export function UploadPlaceholder({ tool }: { tool: Tool }) {
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<StatusType>("idle");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadName, setDownloadName] = useState("resultado");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const multiple = tool.slug === "unir-pdf";
  const copy = getToolCopy(tool, multiple);

  const accepts = useMemo(() => {
    if (tool.category === "imagenes") return "image/jpeg,image/png,image/webp";
    if (tool.category === "pdf") {
      return tool.slug === "word-a-pdf"
        ? ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        : "application/pdf";
    }
    return "";
  }, [tool.category, tool.slug]);

  const fileHelp = useMemo(() => {
    if (tool.slug === "word-a-pdf") return "DOCX";
    if (tool.category === "pdf") return multiple ? "PDF, puedes seleccionar varios" : "PDF";
    if (tool.category === "imagenes") return "JPG, PNG o WEBP";
    return "Archivo";
  }, [multiple, tool.category, tool.slug]);

  const updateFiles = (files: FileList | File[]) => {
    const nextFiles = Array.from(files);
    setSelectedFiles(multiple ? nextFiles : nextFiles.slice(0, 1));
    setDownloadUrl("");
    setStatus("");
    setStatusType("idle");
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragActive(false);
    if (event.dataTransfer.files.length) {
      updateFiles(event.dataTransfer.files);
    }
  };

  const processFile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Procesando archivo...");
    setStatusType("loading");
    setDownloadUrl("");

    if (!selectedFiles.length) {
      setStatus("Selecciona o arrastra un archivo antes de procesar.");
      setStatusType("error");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const fileField = multiple ? "files" : "file";
    formData.delete(fileField);
    selectedFiles.forEach((file) => formData.append(fileField, file));

    try {
      const response = await fetch(`/api/tools/${tool.slug}`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
          ? ((await response.json()) as { error?: string })
          : { error: await response.text() };
        const message =
          data.error?.trim() === "Internal Server Error"
            ? "El servidor no pudo procesar este archivo ahora. Revisa que el deploy de Hostinger tenga soporte para funciones Node.js y vuelve a intentarlo."
            : data.error;
        throw new Error(message || "No se pudo procesar el archivo.");
      }

      const blob = await response.blob();
      const disposition = response.headers.get("content-disposition") || "";
      const filename = disposition.match(/filename="([^"]+)"/)?.[1] || "resultado";
      setDownloadName(filename);
      setDownloadUrl(URL.createObjectURL(blob));
      setStatus("Archivo listo para descargar.");
      setStatusType("success");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se pudo procesar el archivo.");
      setStatusType("error");
    }
  };

  return (
    <form className="rounded-md border border-slate-200 bg-white p-5 shadow-sm" onSubmit={processFile}>
      <div className="mb-5">
        <p className="text-sm font-black uppercase tracking-wide text-teal-700">{copy.eyebrow}</p>
        <h2 className="mt-1 text-xl font-black text-slate-950">{copy.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{copy.description}</p>
      </div>

      <label
        className={`focus-ring block cursor-pointer rounded-md border-2 border-dashed p-6 text-center transition ${
          dragActive
            ? "border-teal-500 bg-teal-50"
            : "border-slate-300 bg-slate-50 hover:border-teal-400 hover:bg-teal-50/60"
        }`}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDrop={handleDrop}
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-700 text-xl font-black text-white">
          +
        </span>
        <span className="mt-4 block text-lg font-black text-slate-900">
          Arrastra y suelta tu archivo aqui
        </span>
        <span className="mt-1 block text-sm font-bold text-teal-700">o haz clic para seleccionar</span>
        <span className="mt-2 block text-sm text-slate-500">Formato admitido: {fileHelp}</span>
        <input
          accept={accepts}
          className="sr-only"
          multiple={multiple}
          name={multiple ? "files" : "file"}
          onChange={(event) => {
            if (event.target.files) updateFiles(event.target.files);
          }}
          required
          type="file"
        />
      </label>

      {selectedFiles.length ? (
        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase text-slate-500">
            {selectedFiles.length === 1 ? "Archivo seleccionado" : "Archivos seleccionados"}
          </p>
          <ul className="mt-2 space-y-2 text-sm font-bold text-slate-700">
            {selectedFiles.map((file) => (
              <li
                className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-white px-3 py-2"
                key={`${file.name}-${file.size}`}
              >
                <span className="break-all">{file.name}</span>
                <span className="text-xs text-slate-500">{formatFileSize(file.size)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {tool.slug === "dividir-pdf" ? (
        <div className="mt-4 rounded-md border border-slate-200 bg-white p-4">
          <label className="block text-sm font-black text-slate-800">
            Paginas a extraer
            <input
              className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-4 py-3 text-base"
              defaultValue="1"
              name="pages"
              placeholder="Ejemplo: 1-3,5"
            />
          </label>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Escribe paginas individuales o rangos separados por comas. Ejemplo: 1, 3-5, 8.
          </p>
        </div>
      ) : null}

      {tool.category === "imagenes" ? (
        <div className="mt-4 rounded-md border border-slate-200 bg-white p-4">
          <p className="text-sm font-black text-slate-800">Opciones de imagen</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <label className="block text-sm font-bold text-slate-700">
              Calidad
              <input
                className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-4 py-3"
                defaultValue="82"
                max="95"
                min="40"
                name="quality"
                type="number"
              />
              <span className="mt-1 block text-xs font-medium text-slate-500">
                Entre 40 y 95. Recomendado: 82.
              </span>
            </label>
            {tool.slug === "redimensionar-imagen" ? (
              <>
                <label className="block text-sm font-bold text-slate-700">
                  Ancho
                  <input
                    className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-4 py-3"
                    min="1"
                    name="width"
                    placeholder="1080"
                    type="number"
                  />
                  <span className="mt-1 block text-xs font-medium text-slate-500">
                    Dejalo vacio para mantener proporcion.
                  </span>
                </label>
                <label className="block text-sm font-bold text-slate-700">
                  Alto
                  <input
                    className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-4 py-3"
                    min="1"
                    name="height"
                    placeholder="1080"
                    type="number"
                  />
                  <span className="mt-1 block text-xs font-medium text-slate-500">
                    Opcional si solo necesitas ancho.
                  </span>
                </label>
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mt-4 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        <p className="font-bold text-slate-800">{copy.noteTitle}</p>
        <p className="mt-1">{copy.note}</p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          className="focus-ring rounded-md bg-teal-700 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={statusType === "loading"}
          type="submit"
        >
          {statusType === "loading" ? "Procesando..." : copy.button}
        </button>
        {downloadUrl ? (
          <a
            className="focus-ring rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-teal-500 hover:text-teal-800"
            download={downloadName}
            href={downloadUrl}
          >
            Descargar resultado
          </a>
        ) : null}
      </div>

      {status ? (
        <p
          className={`mt-4 rounded-md px-4 py-3 text-sm font-bold ${
            statusType === "success"
              ? "bg-emerald-50 text-emerald-800"
              : statusType === "error"
                ? "bg-red-50 text-red-800"
                : "bg-slate-50 text-slate-700"
          }`}
        >
          {status}
        </p>
      ) : null}
    </form>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function getToolCopy(tool: Tool, multiple: boolean): UploadCopy {
  const generic = {
    eyebrow: "Archivo seguro",
    title: `Sube tu archivo para ${tool.name.toLowerCase()}`,
    description: "Selecciona un archivo desde tu dispositivo o arrastralo al area de carga.",
    noteTitle: "Procesamiento rapido",
    note: "Validamos el formato y el tamano antes de generar el resultado descargable.",
    button: "Procesar archivo"
  };

  const copy: Record<string, UploadCopy> = {
    "word-a-pdf": {
      eyebrow: "Conversion DOCX",
      title: "Convierte un documento Word en PDF",
      description: "Sube un archivo DOCX y genera un PDF descargable en pocos segundos.",
      noteTitle: "Recomendacion",
      note: "Funciona mejor con documentos de texto. Si el archivo contiene disenos complejos, revisa el resultado antes de compartirlo.",
      button: "Convertir a PDF"
    },
    "pdf-a-word": {
      eyebrow: "Conversion PDF",
      title: "Convierte un PDF en documento Word",
      description: "Sube un PDF con texto seleccionable para crear un archivo DOCX editable.",
      noteTitle: "Importante",
      note: "Los PDF escaneados o basados en imagenes necesitan OCR y pueden no extraer texto correctamente.",
      button: "Convertir a Word"
    },
    "comprimir-pdf": {
      eyebrow: "Optimizacion PDF",
      title: "Reduce el peso de tu PDF",
      description: "Sube un PDF para reconstruirlo y generar una version mas ligera cuando sea posible.",
      noteTitle: "Consejo",
      note: "La reduccion depende del contenido original. Los PDF con muchas imagenes suelen ofrecer mayor margen de optimizacion.",
      button: "Comprimir PDF"
    },
    "unir-pdf": {
      eyebrow: "Organizacion PDF",
      title: "Une varios PDF en un solo archivo",
      description: multiple
        ? "Selecciona dos o mas PDF en el orden en que quieres combinarlos."
        : "Selecciona tus PDF para combinarlos en un documento final.",
      noteTitle: "Orden de union",
      note: "Los archivos se combinan siguiendo el orden en que los seleccionas.",
      button: "Unir PDF"
    },
    "dividir-pdf": {
      eyebrow: "Extraccion PDF",
      title: "Extrae paginas de un PDF",
      description: "Sube un PDF y define las paginas o rangos que quieres conservar.",
      noteTitle: "Formato de rangos",
      note: "Puedes usar paginas individuales o rangos separados por comas, por ejemplo: 1, 3-5, 8.",
      button: "Dividir PDF"
    },
    "jpg-a-png": {
      eyebrow: "Conversion de imagen",
      title: "Convierte JPG a PNG",
      description: "Sube una imagen JPG y descarga una version PNG lista para usar.",
      noteTitle: "Formato final",
      note: "El PNG es util cuando necesitas compatibilidad amplia o conservar mejor detalles graficos.",
      button: "Convertir a PNG"
    },
    "png-a-jpg": {
      eyebrow: "Conversion de imagen",
      title: "Convierte PNG a JPG",
      description: "Sube una imagen PNG y genera un JPG mas practico para web, correo o redes.",
      noteTitle: "Fondo blanco",
      note: "Si el PNG tiene transparencia, se convertira sobre fondo blanco para crear el JPG.",
      button: "Convertir a JPG"
    },
    "webp-a-jpg": {
      eyebrow: "Conversion de imagen",
      title: "Convierte WEBP a JPG",
      description: "Sube una imagen WEBP y descarga una version JPG compatible con mas plataformas.",
      noteTitle: "Compatibilidad",
      note: "JPG suele funcionar mejor en formularios, correos y sistemas que no aceptan WEBP.",
      button: "Convertir a JPG"
    },
    "comprimir-imagen": {
      eyebrow: "Optimizacion de imagen",
      title: "Comprime una imagen",
      description: "Sube una imagen JPG, PNG o WEBP y ajusta la calidad para reducir su peso.",
      noteTitle: "Calidad recomendada",
      note: "Un valor entre 75 y 85 suele equilibrar bien calidad visual y tamano de archivo.",
      button: "Comprimir imagen"
    },
    "redimensionar-imagen": {
      eyebrow: "Tamano de imagen",
      title: "Cambia el tamano de una imagen",
      description: "Sube una imagen y define ancho, alto o ambos para adaptarla a redes, web o documentos.",
      noteTitle: "Proporcion automatica",
      note: "Si solo escribes ancho o alto, la herramienta mantiene la proporcion original.",
      button: "Redimensionar imagen"
    }
  };

  return copy[tool.slug] || generic;
}
