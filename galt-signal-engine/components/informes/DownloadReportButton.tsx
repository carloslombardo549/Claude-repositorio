"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function DownloadReportButton({ contenido, fileName }: { contenido: string; fileName: string }) {
  function descargar() {
    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="primary" onClick={descargar}>
      <Download className="h-4 w-4" />
      Descargar informe semanal
    </Button>
  );
}
