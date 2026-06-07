import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Captia — Sistema de captación B2B",
  description: "Plataforma interna de captación B2B para agencias: ICP, importación CSV de Apollo, clasificación A/B/C, campañas con aprobación humana y pipeline comercial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
