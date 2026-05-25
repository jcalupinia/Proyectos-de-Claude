"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportElementToPDF(
  elementId: string,
  filename: string,
  title?: string
) {
  const el = document.getElementById(elementId);
  if (!el) throw new Error(`Element ${elementId} not found`);

  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? "landscape" : "portrait",
    unit: "px",
    format: [canvas.width, canvas.height + (title ? 80 : 40)],
    hotfixes: ["px_scaling"],
  });

  if (title) {
    pdf.setFontSize(20);
    pdf.setTextColor(15, 23, 42);
    pdf.text(title, 40, 40);
    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139);
    pdf.text(
      `Generado: ${new Date().toLocaleString("es-EC")}`,
      40,
      60
    );
    pdf.addImage(imgData, "PNG", 0, 80, canvas.width, canvas.height);
  } else {
    pdf.addImage(imgData, "PNG", 0, 40, canvas.width, canvas.height);
  }

  pdf.save(filename);
}

export async function exportElementToPNG(elementId: string, filename: string) {
  const el = document.getElementById(elementId);
  if (!el) throw new Error(`Element ${elementId} not found`);
  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
