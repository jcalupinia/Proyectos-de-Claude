"use client";

import * as XLSX from "xlsx";
import type { Dataset, Row } from "./types";

export type ParsedDocument = {
  fileName: string;
  fileSize: number;
  kind:
    | "spreadsheet"
    | "word"
    | "pdf"
    | "powerpoint"
    | "text"
    | "image"
    | "powerbi"
    | "unknown";
  // Tabular content (Excel/CSV → ready to use in reports)
  datasets?: { sheetName: string; headers: string[]; rows: Row[] }[];
  // Free-form text content (Word, PDF, PPT, TXT)
  text?: string;
  // Image preview (data URL) + dimensions for images
  image?: { dataUrl: string; width: number; height: number };
  // Detected tables inside text content (heuristic) — can be converted to Dataset
  detectedTables?: { headers: string[]; rows: Row[] }[];
  pages?: number;
  warnings?: string[];
};

export async function parseAny(file: File): Promise<ParsedDocument> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const size = file.size;
  switch (ext) {
    case "xlsx":
    case "xls":
    case "csv":
      return parseSpreadsheet(file);
    case "docx":
      return parseDocx(file);
    case "pdf":
      return parsePdf(file);
    case "pptx":
      return parsePptx(file);
    case "txt":
    case "md":
    case "json":
      return parseText(file);
    case "png":
    case "jpg":
    case "jpeg":
    case "webp":
    case "gif":
    case "bmp":
      return parseImage(file);
    case "pbix":
      return {
        fileName: file.name,
        fileSize: size,
        kind: "powerbi",
        warnings: [
          "Los archivos .pbix de Power BI son formato propietario cifrado y no pueden leerse en el navegador. Exporta los datos desde Power BI a Excel (.xlsx) o CSV y vuelve a subir.",
        ],
      };
    default:
      return {
        fileName: file.name,
        fileSize: size,
        kind: "unknown",
        warnings: [`Formato .${ext} no reconocido. Intenta convertir a PDF, Excel o TXT.`],
      };
  }
}

async function parseSpreadsheet(file: File): Promise<ParsedDocument> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array", cellDates: true });
  const datasets = wb.SheetNames.map((sheetName) => {
    const ws = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Row>(ws, { defval: null });
    const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
    return { sheetName, headers, rows };
  });
  return {
    fileName: file.name,
    fileSize: file.size,
    kind: "spreadsheet",
    datasets,
  };
}

async function parseDocx(file: File): Promise<ParsedDocument> {
  const mammoth = await import("mammoth");
  const buf = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buf });
  const text = result.value;
  return {
    fileName: file.name,
    fileSize: file.size,
    kind: "word",
    text,
    detectedTables: detectTables(text),
    warnings: result.messages.map((m) => m.message).slice(0, 3),
  };
}

async function parsePdf(file: File): Promise<ParsedDocument> {
  const pdfjs = await import("pdfjs-dist");
  // Use a CDN worker that matches the installed version
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pdfjs as any).GlobalWorkerOptions.workerSrc =
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  const chunks: string[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageText = (content.items as any[])
      .map((i) => i.str ?? "")
      .join(" ");
    chunks.push(`--- Página ${p} ---\n${pageText}`);
  }
  const text = chunks.join("\n\n");
  return {
    fileName: file.name,
    fileSize: file.size,
    kind: "pdf",
    text,
    pages: doc.numPages,
    detectedTables: detectTables(text),
  };
}

async function parsePptx(file: File): Promise<ParsedDocument> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const slideFiles = Object.keys(zip.files)
    .filter((p) => /^ppt\/slides\/slide\d+\.xml$/.test(p))
    .sort((a, b) => {
      const na = parseInt(a.match(/slide(\d+)/)?.[1] ?? "0");
      const nb = parseInt(b.match(/slide(\d+)/)?.[1] ?? "0");
      return na - nb;
    });

  const chunks: string[] = [];
  for (let i = 0; i < slideFiles.length; i++) {
    const xml = await zip.files[slideFiles[i]].async("string");
    // Extract text inside <a:t>…</a:t> nodes
    const texts = Array.from(xml.matchAll(/<a:t[^>]*>([^<]*)<\/a:t>/g)).map(
      (m) => decodeXml(m[1])
    );
    if (texts.length > 0) {
      chunks.push(`--- Diapositiva ${i + 1} ---\n${texts.join("\n")}`);
    }
  }
  const text = chunks.join("\n\n");
  return {
    fileName: file.name,
    fileSize: file.size,
    kind: "powerpoint",
    text,
    pages: slideFiles.length,
    detectedTables: detectTables(text),
  };
}

async function parseText(file: File): Promise<ParsedDocument> {
  const text = await file.text();
  return {
    fileName: file.name,
    fileSize: file.size,
    kind: "text",
    text,
    detectedTables: detectTables(text),
  };
}

async function parseImage(file: File): Promise<ParsedDocument> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const dims = await new Promise<{ width: number; height: number }>(
    (resolve) => {
      const img = new Image();
      img.onload = () =>
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve({ width: 0, height: 0 });
      img.src = dataUrl;
    }
  );
  return {
    fileName: file.name,
    fileSize: file.size,
    kind: "image",
    image: { dataUrl, ...dims },
    warnings: [
      "Las imágenes se muestran como referencia visual. Para extraer datos numéricos o usar OCR, conecta la API de Claude (botón \"Análisis con IA\").",
    ],
  };
}

function decodeXml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

// Heuristic table detection: lines with consistent separator (tabs, multiple spaces, pipes)
function detectTables(text: string): { headers: string[]; rows: Row[] }[] {
  const lines = text.split(/\r?\n/);
  const tables: { headers: string[]; rows: Row[] }[] = [];
  let current: { headers: string[]; rows: Row[] } | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (current && current.rows.length > 0) {
        tables.push(current);
        current = null;
      }
      continue;
    }
    const cells = splitRow(line);
    if (!cells || cells.length < 2) {
      if (current && current.rows.length > 0) {
        tables.push(current);
        current = null;
      }
      continue;
    }
    if (!current) {
      current = { headers: cells, rows: [] };
    } else if (cells.length === current.headers.length) {
      const row: Row = {};
      current.headers.forEach((h, i) => {
        const v = cells[i];
        const n = parseLocalNumber(v);
        row[h] = n !== null ? n : v;
      });
      current.rows.push(row);
    } else {
      if (current.rows.length > 0) tables.push(current);
      current = { headers: cells, rows: [] };
    }
  }
  if (current && current.rows.length > 0) tables.push(current);
  return tables.filter((t) => t.rows.length >= 2);
}

function splitRow(line: string): string[] | null {
  if (line.includes("\t")) return line.split("\t").map((s) => s.trim());
  if (line.includes("|")) {
    const parts = line
      .split("|")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (parts.length >= 2) return parts;
  }
  // 2+ spaces as separator
  const parts = line.split(/\s{2,}/).map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) return parts;
  return null;
}

function parseLocalNumber(v: string): number | null {
  const cleaned = v
    .replace(/[\s$€USD]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

export function toDataset(
  parsed: ParsedDocument,
  sheetIndex = 0,
  tableIndex?: number
): Dataset | null {
  if (parsed.kind === "spreadsheet" && parsed.datasets?.[sheetIndex]) {
    const d = parsed.datasets[sheetIndex];
    return {
      fileName: parsed.fileName,
      sheetName: d.sheetName,
      headers: d.headers,
      rows: d.rows,
    };
  }
  if (tableIndex !== undefined && parsed.detectedTables?.[tableIndex]) {
    const t = parsed.detectedTables[tableIndex];
    return {
      fileName: parsed.fileName,
      sheetName: `Tabla detectada ${tableIndex + 1}`,
      headers: t.headers,
      rows: t.rows,
    };
  }
  return null;
}
