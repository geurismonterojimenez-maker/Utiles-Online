import { Document, Packer, Paragraph, TextRun } from "docx";
import * as mammoth from "mammoth";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import sharp from "sharp";
import { assertFileSize, assertMime, safeFilename } from "@/lib/security";
import type { Tool } from "@/lib/tools";

type ProcessedFile = {
  buffer: Uint8Array;
  filename: string;
  contentType: string;
};

const imageTypes = ["image/jpeg", "image/png", "image/webp"];
const pdfTypes = ["application/pdf"];
const docxTypes = ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

async function fileToBytes(file: File) {
  return new Uint8Array(await file.arrayBuffer());
}

function requiredFile(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("Debes enviar un archivo valido.");
  }
  return file;
}

function requiredFiles(formData: FormData) {
  const files = formData.getAll("files").filter((file): file is File => file instanceof File);
  if (!files.length) {
    const single = formData.get("file");
    if (single instanceof File) return [single];
  }
  if (!files.length) throw new Error("Debes enviar al menos un archivo valido.");
  return files;
}

export async function processToolFile(tool: Tool, formData: FormData): Promise<ProcessedFile> {
  if (tool.category === "imagenes") {
    return processImageTool(tool.slug, formData);
  }

  if (tool.category === "pdf") {
    return processPdfTool(tool.slug, formData);
  }

  throw new Error("Esta herramienta funciona directamente en el navegador y no requiere API.");
}

async function processImageTool(slug: string, formData: FormData): Promise<ProcessedFile> {
  const file = requiredFile(formData);
  assertFileSize(file, 12);
  assertMime(file, imageTypes, [".jpg", ".jpeg", ".png", ".webp"]);

  const input = await fileToBytes(file);
  const quality = clamp(Number(formData.get("quality") || 82), 40, 95);
  const width = Number(formData.get("width") || 0);
  const height = Number(formData.get("height") || 0);
  let image = sharp(input, { failOn: "none" }).rotate();
  let contentType = "image/jpeg";
  let extension = "jpg";

  if (slug === "redimensionar-imagen" && (width > 0 || height > 0)) {
    image = image.resize({
      width: width > 0 ? Math.min(width, 5000) : undefined,
      height: height > 0 ? Math.min(height, 5000) : undefined,
      fit: "inside",
      withoutEnlargement: true
    });
  }

  if (slug === "jpg-a-png") {
    image = image.png({ compressionLevel: 9 });
    contentType = "image/png";
    extension = "png";
  } else if (slug === "comprimir-imagen" && file.type === "image/png") {
    image = image.png({ compressionLevel: 9, palette: true });
    contentType = "image/png";
    extension = "png";
  } else if (slug === "comprimir-imagen" && file.type === "image/webp") {
    image = image.webp({ quality });
    contentType = "image/webp";
    extension = "webp";
  } else if (slug === "redimensionar-imagen" && file.type === "image/png") {
    image = image.png({ compressionLevel: 9 });
    contentType = "image/png";
    extension = "png";
  } else if (slug === "redimensionar-imagen" && file.type === "image/webp") {
    image = image.webp({ quality });
    contentType = "image/webp";
    extension = "webp";
  } else {
    image = image.flatten({ background: "#ffffff" }).jpeg({ quality, mozjpeg: true });
  }

  const buffer = await image.toBuffer();
  return {
    buffer,
    contentType,
    filename: `${safeFilename(file.name.replace(/\.[^.]+$/, ""))}.${extension}`
  };
}

async function processPdfTool(slug: string, formData: FormData): Promise<ProcessedFile> {
  if (slug === "word-a-pdf") {
    return wordToPdf(formData);
  }

  if (slug === "pdf-a-word") {
    return pdfToWord(formData);
  }

  const files = requiredFiles(formData);
  for (const file of files) {
    assertFileSize(file, 25);
    assertMime(file, pdfTypes, [".pdf"]);
  }

  if (slug === "unir-pdf") {
    return mergePdf(files);
  }

  const firstFile = files[0];
  if (slug === "dividir-pdf") {
    return splitPdf(firstFile, String(formData.get("pages") || "1"));
  }

  if (slug === "comprimir-pdf") {
    return rebuildPdf(firstFile);
  }

  throw new Error("Procesamiento PDF no disponible para esta herramienta.");
}

async function wordToPdf(formData: FormData): Promise<ProcessedFile> {
  const file = requiredFile(formData);
  assertFileSize(file, 15);
  assertMime(file, docxTypes, [".docx"]);

  const bytes = await fileToBytes(file);
  const extracted = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });
  const text = extracted.value.trim();

  if (!text) {
    throw new Error("No se pudo extraer texto del DOCX. Revisa que el archivo no este vacio o protegido.");
  }

  return {
    buffer: await createPdfFromText(text, file.name.replace(/\.docx$/i, "")),
    contentType: "application/pdf",
    filename: `${safeFilename(file.name.replace(/\.docx$/i, ""))}.pdf`
  };
}

async function pdfToWord(formData: FormData): Promise<ProcessedFile> {
  const file = requiredFile(formData);
  assertFileSize(file, 25);
  assertMime(file, pdfTypes, [".pdf"]);

  const bytes = await fileToBytes(file);
  ensurePdfTextRuntime();
  const text = (await extractPdfText(bytes)).trim();

  if (!text) {
    throw new Error("No se pudo extraer texto del PDF. Puede ser un PDF escaneado o protegido.");
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: text
          .split(/\n{2,}/)
          .map((paragraph: string) => paragraph.trim())
          .filter(Boolean)
          .map(
            (paragraph: string) =>
              new Paragraph({
                children: [new TextRun(paragraph)]
              })
          )
      }
    ]
  });

  return {
    buffer: await Packer.toBuffer(doc),
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    filename: `${safeFilename(file.name.replace(/\.pdf$/i, ""))}.docx`
  };
}

async function extractPdfText(bytes: Uint8Array) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const path = await import("node:path");
  const { pathToFileURL } = await import("node:url");
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(
    path.join(process.cwd(), "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs")
  ).href;

  const loadingTask = pdfjs.getDocument({
    data: bytes.slice(),
    disableWorker: true,
    useSystemFonts: true
  } as Parameters<typeof pdfjs.getDocument>[0]);
  const pdf = await loadingTask.promise;
  const pages: string[] = [];

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      if (pageText) pages.push(pageText);
      page.cleanup();
    }
  } finally {
    await pdf.destroy();
  }

  return pages.join("\n\n");
}

function ensurePdfTextRuntime() {
  const globalScope = globalThis as unknown as Record<string, unknown>;

  if (!globalScope.DOMMatrix) {
    globalScope.DOMMatrix = MinimalDOMMatrix;
  }
}

class MinimalDOMMatrix {
  a = 1;
  b = 0;
  c = 0;
  d = 1;
  e = 0;
  f = 0;

  constructor(init?: string | number[]) {
    if (Array.isArray(init)) {
      [this.a, this.b, this.c, this.d, this.e, this.f] = [
        init[0] ?? 1,
        init[1] ?? 0,
        init[2] ?? 0,
        init[3] ?? 1,
        init[4] ?? 0,
        init[5] ?? 0
      ];
    }
  }

  multiplySelf() {
    return this;
  }

  preMultiplySelf() {
    return this;
  }

  translateSelf() {
    return this;
  }

  scaleSelf() {
    return this;
  }

  rotateSelf() {
    return this;
  }
}

async function mergePdf(files: File[]): Promise<ProcessedFile> {
  const output = await PDFDocument.create();

  for (const file of files) {
    const input = await PDFDocument.load(await fileToBytes(file), { ignoreEncryption: true });
    const copiedPages = await output.copyPages(input, input.getPageIndices());
    copiedPages.forEach((page) => output.addPage(page));
  }

  const buffer = await output.save({ useObjectStreams: true });
  return {
    buffer,
    contentType: "application/pdf",
    filename: "pdf-unido.pdf"
  };
}

async function splitPdf(file: File, pagesValue: string): Promise<ProcessedFile> {
  const input = await PDFDocument.load(await fileToBytes(file), { ignoreEncryption: true });
  const selectedIndexes = parsePageRanges(pagesValue, input.getPageCount());
  const output = await PDFDocument.create();
  const copiedPages = await output.copyPages(input, selectedIndexes);
  copiedPages.forEach((page) => output.addPage(page));
  const buffer = await output.save({ useObjectStreams: true });

  return {
    buffer,
    contentType: "application/pdf",
    filename: `${safeFilename(file.name.replace(/\.pdf$/i, ""))}-paginas.pdf`
  };
}

async function rebuildPdf(file: File): Promise<ProcessedFile> {
  const input = await PDFDocument.load(await fileToBytes(file), { ignoreEncryption: true });
  const output = await PDFDocument.create();
  const copiedPages = await output.copyPages(input, input.getPageIndices());
  copiedPages.forEach((page) => output.addPage(page));
  const buffer = await output.save({ useObjectStreams: true });

  return {
    buffer,
    contentType: "application/pdf",
    filename: `${safeFilename(file.name.replace(/\.pdf$/i, ""))}-optimizado.pdf`
  };
}

async function createPdfFromText(text: string, title: string) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pageSize: [number, number] = [595.28, 841.89];
  const margin = 56;
  const fontSize = 11;
  const lineHeight = 16;
  const maxWidth = pageSize[0] - margin * 2;
  let page = pdf.addPage(pageSize);
  let y = pageSize[1] - margin;

  const drawLine = (line: string, options?: { title?: boolean }) => {
    const activeFont = options?.title ? bold : font;
    const activeSize = options?.title ? 18 : fontSize;
    if (y < margin + lineHeight) {
      page = pdf.addPage(pageSize);
      y = pageSize[1] - margin;
    }
    page.drawText(cleanPdfText(line), {
      x: margin,
      y,
      size: activeSize,
      font: activeFont,
      color: rgb(0.09, 0.13, 0.2)
    });
    y -= options?.title ? 28 : lineHeight;
  };

  drawLine(title || "Documento convertido", { title: true });

  text.split(/\n{2,}/).forEach((paragraph) => {
    const clean = paragraph.replace(/\s+/g, " ").trim();
    if (!clean) return;
    wrapText(clean, maxWidth, font, fontSize).forEach((line) => drawLine(line));
    y -= 8;
  });

  return pdf.save({ useObjectStreams: true });
}

function cleanPdfText(value: string) {
  return value.replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\u00FF]/g, "");
}

function wrapText(text: string, maxWidth: number, font: { widthOfTextAtSize: (text: string, size: number) => number }, size: number) {
  const words = cleanPdfText(text).split(/\s+/);
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
      return;
    }
    if (current) lines.push(current);
    current = word;
  });

  if (current) lines.push(current);
  return lines;
}

function parsePageRanges(value: string, pageCount: number) {
  const indexes = new Set<number>();
  value.split(",").forEach((part) => {
    const [startRaw, endRaw] = part.trim().split("-");
    const start = clamp(Number(startRaw), 1, pageCount);
    const end = clamp(Number(endRaw || startRaw), 1, pageCount);
    for (let page = Math.min(start, end); page <= Math.max(start, end); page += 1) {
      indexes.add(page - 1);
    }
  });
  return Array.from(indexes).sort((a, b) => a - b);
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}
