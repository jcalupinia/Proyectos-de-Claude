"use client";

import type { ParsedDocument } from "./parsers";

const API_KEY_STORAGE = "fin-dashboard-anthropic-key";
const MODEL_STORAGE = "fin-dashboard-anthropic-model";

export const DEFAULT_MODEL = "claude-sonnet-4-6";

export function getApiKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(API_KEY_STORAGE) ?? "";
}

export function setApiKey(key: string) {
  if (key) localStorage.setItem(API_KEY_STORAGE, key);
  else localStorage.removeItem(API_KEY_STORAGE);
}

export function getModel(): string {
  if (typeof window === "undefined") return DEFAULT_MODEL;
  return localStorage.getItem(MODEL_STORAGE) ?? DEFAULT_MODEL;
}

export function setModel(m: string) {
  localStorage.setItem(MODEL_STORAGE, m);
}

export type AIRequest = {
  doc: ParsedDocument;
  question: string;
};

export async function analyzeDocument(
  req: AIRequest,
  onChunk?: (text: string) => void
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("Falta API key de Anthropic. Configúrala en el botón \"⚙️ Configurar IA\".");
  const model = getModel();

  const userContent = buildUserContent(req);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      stream: !!onChunk,
      system:
        "Eres un asistente experto en análisis financiero y contable. Trabajas con gerentes financieros en Ecuador y Latinoamérica. Responde en español, con números formateados al estilo local (separador de miles con puntos, decimales con coma cuando aplique), y enfocándote en insights accionables. Si el documento contiene estados financieros, identifica anomalías, variaciones materiales y tendencias. Si es un documento descriptivo, extrae los datos numéricos clave y resúmelos.",
      messages: [{ role: "user", content: userContent }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${text.slice(0, 400)}`);
  }

  if (!onChunk) {
    const json = await res.json();
    return (json.content?.[0]?.text as string) ?? "";
  }

  // SSE streaming
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const evt = JSON.parse(data);
        if (
          evt.type === "content_block_delta" &&
          evt.delta?.type === "text_delta"
        ) {
          full += evt.delta.text;
          onChunk(evt.delta.text);
        }
      } catch {
        /* ignore parse errors */
      }
    }
  }
  return full;
}

function buildUserContent(
  req: AIRequest
):
  | string
  | Array<
      | { type: "text"; text: string }
      | {
          type: "image";
          source: { type: "base64"; media_type: string; data: string };
        }
    > {
  const { doc, question } = req;
  const header = `Documento: ${doc.fileName} (${labelKind(doc.kind)})\nPregunta del usuario: ${question}\n\n`;

  if (doc.kind === "image" && doc.image) {
    const [meta, b64] = doc.image.dataUrl.split(",");
    const mediaType = (meta.match(/data:(.*?);/) ?? [])[1] ?? "image/png";
    return [
      {
        type: "image",
        source: { type: "base64", media_type: mediaType, data: b64 },
      },
      {
        type: "text",
        text: `${header}Analiza la imagen como gerente financiero. Si contiene tablas, transcríbelas; si son gráficos, interpreta tendencias; si son facturas/comprobantes, extrae totales, fechas y conceptos.`,
      },
    ];
  }

  if (doc.kind === "spreadsheet" && doc.datasets) {
    const summary = doc.datasets
      .map((d) => {
        const sample = d.rows.slice(0, 30);
        return `Hoja: ${d.sheetName} (${d.rows.length} filas, ${d.headers.length} columnas)\nColumnas: ${d.headers.join(", ")}\nMuestra (primeras ${sample.length} filas):\n${JSON.stringify(sample, null, 2)}`;
      })
      .join("\n\n---\n\n");
    return `${header}Contenido del archivo (resumen):\n${summary}`;
  }

  const text = doc.text ?? "";
  const truncated =
    text.length > 60000
      ? text.slice(0, 60000) + `\n\n[Texto truncado a 60k caracteres de ${text.length.toLocaleString()} totales]`
      : text;
  return `${header}Contenido del documento:\n\n${truncated}`;
}

function labelKind(k: ParsedDocument["kind"]): string {
  return (
    {
      spreadsheet: "hoja de cálculo",
      word: "documento Word",
      pdf: "PDF",
      powerpoint: "presentación PowerPoint",
      text: "texto plano",
      image: "imagen",
      powerbi: "archivo Power BI",
      unknown: "documento",
    } as const
  )[k];
}
