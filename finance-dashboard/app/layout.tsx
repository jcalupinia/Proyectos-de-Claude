import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finance Dashboard | Reportes para Gerencia Financiera",
  description:
    "Aplicación 100% local en el navegador para automatizar reportes financieros desde Excel: variaciones, ratios, análisis vertical/horizontal y flujo de caja.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-ink-100/40 antialiased">{children}</body>
    </html>
  );
}
