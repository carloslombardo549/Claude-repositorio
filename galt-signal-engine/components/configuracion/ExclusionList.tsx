"use client";

import { useState } from "react";
import { Plus, ShieldOff, Trash2 } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";
import type { ExclusionEntry } from "@/lib/types";

const TIPO_LABEL: Record<ExclusionEntry["tipo"], string> = {
  empresa: "Empresa",
  contacto: "Contacto",
  dominio: "Dominio",
};

export function ExclusionList({ entries: initial }: { entries: ExclusionEntry[] }) {
  const [entries, setEntries] = useState(initial);
  const [nuevoTipo, setNuevoTipo] = useState<ExclusionEntry["tipo"]>("empresa");
  const [nuevoValor, setNuevoValor] = useState("");
  const [nuevoMotivo, setNuevoMotivo] = useState("");

  function añadir() {
    if (!nuevoValor.trim()) return;
    setEntries((prev) => [
      {
        id: `exc-manual-${prev.length + 1}`,
        tipo: nuevoTipo,
        valor: nuevoValor.trim(),
        motivo: nuevoMotivo.trim() || "Añadido manualmente sin motivo especificado.",
        origen: "Añadido manualmente desde Configuración",
        fecha: new Date().toISOString(),
      },
      ...prev,
    ]);
    setNuevoValor("");
    setNuevoMotivo("");
  }

  function eliminar(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <Card>
      <CardBody className="pt-5">
        <div className="mb-4 flex items-start gap-3">
          <ShieldOff className="mt-0.5 h-5 w-5 shrink-0 text-ink-500 dark:text-ink-400" />
          <p className="text-sm text-ink-600 dark:text-ink-400">
            Empresas, contactos y dominios que nunca deben recibir mensajes, independientemente de su puntuación.
            Cualquier flujo de generación o envío respeta esta lista.
          </p>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-[140px_1fr_1fr_auto]">
          <select
            value={nuevoTipo}
            onChange={(e) => setNuevoTipo(e.target.value as ExclusionEntry["tipo"])}
            className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
          >
            <option value="empresa">Empresa</option>
            <option value="contacto">Contacto</option>
            <option value="dominio">Dominio</option>
          </select>
          <input
            value={nuevoValor}
            onChange={(e) => setNuevoValor(e.target.value)}
            placeholder="Nombre, email o dominio…"
            className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
          />
          <input
            value={nuevoMotivo}
            onChange={(e) => setNuevoMotivo(e.target.value)}
            placeholder="Motivo…"
            className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
          />
          <Button variant="primary" onClick={añadir}>
            <Plus className="h-4 w-4" />
            Añadir
          </Button>
        </div>

        {entries.length === 0 ? (
          <EmptyState icon={ShieldOff} title="La lista de exclusión está vacía" />
        ) : (
          <div className="space-y-2">
            {entries.map((e) => (
              <div key={e.id} className="flex items-start justify-between gap-3 rounded-lg border border-ink-100 p-3 dark:border-ink-800">
                <div>
                  <div className="mb-0.5 flex items-center gap-2">
                    <Badge tone="neutral">{TIPO_LABEL[e.tipo]}</Badge>
                    <span className="text-sm font-medium text-ink-900 dark:text-ink-100">{e.valor}</span>
                  </div>
                  <p className="text-xs text-ink-500 dark:text-ink-500">{e.motivo}</p>
                  <p className="text-xs text-ink-400 dark:text-ink-600">
                    Origen: {e.origen} · {formatDate(e.fecha)}
                  </p>
                </div>
                <button
                  onClick={() => eliminar(e.id)}
                  aria-label="Eliminar de la lista de exclusión"
                  className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-danger-600 dark:text-ink-600 dark:hover:bg-ink-800 dark:hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
