import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACAI - Sistema de Adquisición de Clientes con IA",
  description: "Plataforma inteligente para adquisición de clientes B2B con inteligencia artificial",
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
