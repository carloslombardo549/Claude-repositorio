"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ClipboardCheck, ShieldCheck, XCircle } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MensajeEstadoBadge, TipoSenalBadge } from "@/components/ui/domainBadges";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateTime } from "@/lib/format";
import type { EstadoMensaje, Message, Signal } from "@/lib/types";

export interface QueueItem {
  message: Message;
  empresaNombre: string;
  empresaId: string;
  contactoNombre: string;
  contactoCargo: string;
  signal: Signal | undefined;
}

const TABS: { value: EstadoMensaje | "todos"; label: string }[] = [
  { value: "pendiente_aprobacion", label: "Pendientes" },
  { value: "aprobado", label: "Aprobados" },
  { value: "enviado", label: "Enviados" },
  { value: "rechazado", label: "Rechazados" },
  { value: "todos", label: "Todos" },
];

export function ApprovalQueue({ items: initialItems }: { items: QueueItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [tab, setTab] = useState<EstadoMensaje | "todos">("pendiente_aprobacion");
  const [rechazando, setRechazando] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of TABS) {
      c[t.value] = t.value === "todos" ? items.length : items.filter((i) => i.message.estado === t.value).length;
    }
    return c;
  }, [items]);

  const visibles = items.filter((i) => tab === "todos" || i.message.estado === tab);

  function updateMessage(id: string, patch: Partial<Message>) {
    setItems((prev) => prev.map((i) => (i.message.id === id ? { ...i, message: { ...i.message, ...patch } } : i)));
  }

  function aprobar(id: string) {
    updateMessage(id, {
      estado: "aprobado",
      editadoPor: "Tú (revisión manual)",
      fechaAprobacion: new Date().toISOString(),
    });
  }

  function confirmarRechazo(id: string) {
    updateMessage(id, {
      estado: "rechazado",
      fechaRechazo: new Date().toISOString(),
      motivoRechazo: motivo.trim() || "Sin motivo especificado.",
    });
    setRechazando(null);
    setMotivo("");
  }

  function editarCuerpo(id: string, cuerpo: string) {
    updateMessage(id, { cuerpo, editadoPor: "Tú (revisión manual)" });
  }

  return (
    <div>
      <Card className="mb-6 border-gold-200 bg-gold-50/50 dark:border-gold-900/40 dark:bg-gold-950/10">
        <CardBody className="flex items-start gap-3 pt-5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-600 dark:text-gold-400" />
          <p className="text-sm text-ink-700 dark:text-ink-300">
            El envío automático está <strong>desactivado</strong>. Todos los mensajes generados pasan por esta cola y
            requieren aprobación humana explícita antes de poder enviarse.
          </p>
        </CardBody>
      </Card>

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              tab === t.value
                ? "bg-ink-900 text-white dark:bg-gold-500 dark:text-ink-950"
                : "bg-ink-100 text-ink-600 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-700"
            }`}
          >
            {t.label} ({counts[t.value]})
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="No hay mensajes en este estado" />
      ) : (
        <div className="space-y-4">
          {visibles.map((item) => (
            <Card key={item.message.id}>
              <CardBody className="pt-5">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/empresas/${item.empresaId}`} className="text-sm font-semibold text-ink-900 hover:text-gold-600 dark:text-ink-100 dark:hover:text-gold-400">
                        {item.empresaNombre}
                      </Link>
                      <MensajeEstadoBadge estado={item.message.estado} />
                    </div>
                    <p className="text-xs text-ink-500 dark:text-ink-500">
                      Para {item.contactoNombre} · {item.contactoCargo}
                    </p>
                  </div>
                  {item.signal && <TipoSenalBadge tipo={item.signal.tipo} />}
                </div>

                <textarea
                  value={item.message.cuerpo}
                  onChange={(e) => editarCuerpo(item.message.id, e.target.value)}
                  disabled={item.message.estado === "enviado"}
                  rows={9}
                  className="w-full resize-y rounded-xl border border-ink-200 bg-ink-50/60 p-3 font-sans text-sm leading-relaxed text-ink-800 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200 disabled:opacity-70 dark:border-ink-700 dark:bg-ink-800/50 dark:text-ink-200"
                />

                <div className="mt-2 flex items-center justify-between text-xs text-ink-400 dark:text-ink-500">
                  <span>Creado el {formatDateTime(item.message.creadoEn)}</span>
                  {item.message.editadoPor && <span>Editado por {item.message.editadoPor}</span>}
                </div>

                {item.message.estado === "rechazado" && item.message.motivoRechazo && (
                  <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                    Motivo del rechazo: {item.message.motivoRechazo}
                  </p>
                )}

                {rechazando === item.message.id ? (
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      autoFocus
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      placeholder="Motivo del rechazo…"
                      className="flex-1 rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
                    />
                    <div className="flex gap-2">
                      <Button variant="danger" size="sm" onClick={() => confirmarRechazo(item.message.id)}>
                        Confirmar rechazo
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setRechazando(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  item.message.estado === "pendiente_aprobacion" && (
                    <div className="mt-3 flex gap-2">
                      <Button variant="primary" size="sm" onClick={() => aprobar(item.message.id)}>
                        <CheckCircle2 className="h-4 w-4" />
                        Aprobar
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => setRechazando(item.message.id)}>
                        <XCircle className="h-4 w-4" />
                        Rechazar
                      </Button>
                    </div>
                  )
                )}

                {item.message.estado === "aprobado" && (
                  <div className="mt-3">
                    <Badge tone="info">Aprobado — pendiente de envío manual desde el proveedor de email</Badge>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
