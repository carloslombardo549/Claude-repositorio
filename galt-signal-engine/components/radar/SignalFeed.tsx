"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { TipoSenalBadge } from "@/components/ui/domainBadges";
import { EmptyState } from "@/components/ui/EmptyState";
import { Radar } from "lucide-react";
import { formatDate, relativeDays } from "@/lib/format";
import { TIPO_SENAL_LABEL } from "@/lib/scoring";
import type { Signal, TipoSenal } from "@/lib/types";

export interface FeedItem {
  signal: Signal;
  empresaNombre: string;
  empresaId: string;
  sector: string;
}

export function SignalFeed({ items, now }: { items: FeedItem[]; now: Date }) {
  const [tipo, setTipo] = useState<TipoSenal | "todos">("todos");
  const [sector, setSector] = useState("todos");

  const sectores = useMemo(() => [...new Set(items.map((i) => i.sector))].sort(), [items]);
  const tipos = useMemo(() => [...new Set(items.map((i) => i.signal.tipo))], [items]);

  const filtrados = items
    .filter((i) => tipo === "todos" || i.signal.tipo === tipo)
    .filter((i) => sector === "todos" || i.sector === sector)
    .sort((a, b) => (a.signal.fechaDeteccion < b.signal.fechaDeteccion ? 1 : -1));

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoSenal | "todos")}
          className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        >
          <option value="todos">Todos los tipos de señal</option>
          {tipos.map((t) => (
            <option key={t} value={t}>
              {TIPO_SENAL_LABEL[t]}
            </option>
          ))}
        </select>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        >
          <option value="todos">Todos los sectores</option>
          {sectores.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="ml-auto self-center text-xs text-ink-500 dark:text-ink-500">
          {filtrados.length} señal{filtrados.length === 1 ? "" : "es"}
        </span>
      </div>

      {filtrados.length === 0 ? (
        <EmptyState icon={Radar} title="Sin señales para este filtro" />
      ) : (
        <div className="space-y-3">
          {filtrados.map(({ signal, empresaNombre, empresaId }) => (
            <Card key={signal.id}>
              <CardBody className="pt-5">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                  <div>
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <TipoSenalBadge tipo={signal.tipo} />
                      <span className="text-xs text-ink-400 dark:text-ink-500">{relativeDays(signal.fechaDeteccion, now)}</span>
                    </div>
                    <Link href={`/empresas/${empresaId}`} className="text-sm font-medium text-ink-900 hover:text-gold-600 dark:text-ink-100 dark:hover:text-gold-400">
                      {empresaNombre}
                    </Link>
                    <p className="mt-0.5 text-sm text-ink-600 dark:text-ink-400">{signal.descripcion}</p>
                    <p className="mt-1.5 text-xs text-ink-400 dark:text-ink-500">
                      Fuente: {signal.fuenteBase} ·{" "}
                      <a href={signal.fuenteUrl} target="_blank" rel="noreferrer" className="text-gold-700 hover:underline dark:text-gold-400">
                        {signal.fuenteUrl}
                      </a>{" "}
                      ({formatDate(signal.fuenteFecha)})
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
