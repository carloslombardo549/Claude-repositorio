"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MensajeEstadoBadge } from "@/components/ui/domainBadges";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileWarning } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { Message } from "@/lib/types";

export function MessageGeneratorCard({
  message,
  contactoNombre,
  motivoSinEvidencia,
}: {
  message: Message | undefined;
  contactoNombre: string | undefined;
  motivoSinEvidencia?: string;
}) {
  const [revelado, setRevelado] = useState(Boolean(message && message.estado !== "borrador"));
  const [generando, setGenerando] = useState(false);

  if (!message) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generador de mensajes</CardTitle>
        </CardHeader>
        <CardBody>
          <EmptyState
            icon={FileWarning}
            title="No se genera personalización"
            description={
              motivoSinEvidencia ??
              "No hay evidencia suficiente (señal verificable + decisor identificado) para generar un mensaje responsable."
            }
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generador de mensajes</CardTitle>
        <MensajeEstadoBadge estado={message.estado} />
      </CardHeader>
      <CardBody>
        {!revelado ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-ink-300 py-10 dark:border-ink-700">
            <p className="max-w-sm text-center text-sm text-ink-500 dark:text-ink-400">
              Genera un borrador de mensaje para {contactoNombre ?? "el decisor"} a partir de la señal verificable y el
              dossier de investigación de esta empresa.
            </p>
            <Button
              variant="primary"
              disabled={generando}
              onClick={() => {
                setGenerando(true);
                setTimeout(() => {
                  setGenerando(false);
                  setRevelado(true);
                }, 900);
              }}
            >
              <Sparkles className="h-4 w-4" />
              {generando ? "Generando…" : "Generar mensaje"}
            </Button>
          </div>
        ) : (
          <div>
            <pre className="whitespace-pre-wrap rounded-xl bg-ink-50 p-4 font-sans text-sm leading-relaxed text-ink-800 dark:bg-ink-800/60 dark:text-ink-200">
              {message.cuerpo}
            </pre>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-500 dark:text-ink-500">
              <span>Creado el {formatDateTime(message.creadoEn)}</span>
              {message.estado === "pendiente_aprobacion" && (
                <a href="/aprobacion" className="font-medium text-gold-700 hover:underline dark:text-gold-400">
                  Revisar en la cola de aprobación →
                </a>
              )}
              {message.estado === "rechazado" && message.motivoRechazo && (
                <span className="text-danger-600 dark:text-rose-400">Rechazado: {message.motivoRechazo}</span>
              )}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
