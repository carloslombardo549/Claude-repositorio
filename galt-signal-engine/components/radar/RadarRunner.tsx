"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Radar as RadarIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { TipoSenalBadge } from "@/components/ui/domainBadges";
import type { Signal } from "@/lib/types";

const PASOS = [
  "Rastreando fuentes públicas (webs, notas de prensa, ofertas de empleo)…",
  "Detectando señales verificables de necesidad comercial…",
  "Cruzando empresas con el ICP de Galt Capital…",
  "Calculando puntuación y priorizando resultados…",
];

interface Hallazgo {
  signal: Signal;
  empresaNombre: string;
}

export function RadarRunner({ hallazgos, empresasAnalizadas }: { hallazgos: Hallazgo[]; empresasAnalizadas: number }) {
  const [estado, setEstado] = useState<"idle" | "corriendo" | "listo">("idle");
  const [pasoActual, setPasoActual] = useState(0);
  const [ultimaEjecucion, setUltimaEjecucion] = useState<string | null>(null);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timeouts.current.forEach(clearTimeout);
    };
  }, []);

  function ejecutarRadar() {
    setEstado("corriendo");
    setPasoActual(0);
    timeouts.current.forEach(clearTimeout);
    timeouts.current = PASOS.map((_, i) =>
      setTimeout(() => setPasoActual(i), i * 750),
    );
    timeouts.current.push(
      setTimeout(() => {
        setEstado("listo");
        setUltimaEjecucion(new Date().toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" }));
      }, PASOS.length * 750 + 500),
    );
  }

  return (
    <Card className="mb-6">
      <CardBody className="pt-5">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-sm font-semibold text-ink-900 dark:text-ink-100">Radar de señales</h2>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
              Analiza fuentes públicas simuladas y actualiza la puntuación de las empresas objetivo.
            </p>
            {ultimaEjecucion && estado === "listo" && (
              <p className="mt-1 text-xs text-ink-400 dark:text-ink-500">Última ejecución: {ultimaEjecucion}</p>
            )}
          </div>
          <Button variant="primary" onClick={ejecutarRadar} disabled={estado === "corriendo"}>
            {estado === "corriendo" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RadarIcon className="h-4 w-4" />}
            {estado === "corriendo" ? "Ejecutando radar…" : "Ejecutar radar"}
          </Button>
        </div>

        {estado === "corriendo" && (
          <div className="mt-5 space-y-2.5 border-t border-ink-100 pt-4 dark:border-ink-800">
            {PASOS.map((paso, i) => (
              <div key={paso} className="flex items-center gap-2.5 text-sm">
                {i < pasoActual ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success-500" />
                ) : i === pasoActual ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-gold-500" />
                ) : (
                  <span className="h-4 w-4 shrink-0 rounded-full border border-ink-300 dark:border-ink-700" />
                )}
                <span
                  className={
                    i <= pasoActual
                      ? "text-ink-700 dark:text-ink-300"
                      : "text-ink-400 dark:text-ink-600"
                  }
                >
                  {paso}
                </span>
              </div>
            ))}
          </div>
        )}

        {estado === "listo" && (
          <div className="mt-5 border-t border-ink-100 pt-4 dark:border-ink-800">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-success-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Radar completado: {empresasAnalizadas} empresas analizadas, {hallazgos.length} señales recientes
              destacadas
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {hallazgos.map((h) => (
                <div key={h.signal.id} className="rounded-lg border border-gold-200 bg-gold-50/60 p-3 dark:border-gold-900/50 dark:bg-gold-950/20">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <TipoSenalBadge tipo={h.signal.tipo} />
                    <span className="rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-semibold text-ink-950">
                      NUEVO
                    </span>
                  </div>
                  <p className="text-sm font-medium text-ink-800 dark:text-ink-200">{h.empresaNombre}</p>
                  <p className="text-xs text-ink-500 dark:text-ink-500">{h.signal.titulo}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
