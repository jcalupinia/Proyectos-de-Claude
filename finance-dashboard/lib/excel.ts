"use client";

import * as XLSX from "xlsx";
import type { Dataset, Row } from "./types";

export async function readExcelFile(file: File): Promise<{
  sheetNames: string[];
  read: (sheetName: string) => Dataset;
}> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });

  return {
    sheetNames: workbook.SheetNames,
    read: (sheetName: string) => {
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json<Row>(sheet, {
        defval: null,
        raw: true,
      });
      const headers =
        json.length > 0
          ? Object.keys(json[0])
          : (XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 })[0] ??
              []) as unknown as string[];
      return {
        fileName: file.name,
        sheetName,
        headers,
        rows: json,
      };
    },
  };
}

export function exportToExcel(
  filename: string,
  sheets: { name: string; rows: Record<string, unknown>[] }[]
) {
  const wb = XLSX.utils.book_new();
  for (const { name, rows } of sheets) {
    const ws = XLSX.utils.json_to_sheet(rows);

    if (rows.length > 0) {
      const cols = Object.keys(rows[0]).map((key) => {
        const maxLen = Math.max(
          key.length,
          ...rows.slice(0, 200).map((r) => String(r[key] ?? "").length)
        );
        return { wch: Math.min(Math.max(maxLen + 2, 10), 40) };
      });
      ws["!cols"] = cols;
    }

    XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
  }
  XLSX.writeFile(wb, filename);
}
