"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { ClasificacionBadge } from "@/components/ui/domainBadges";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";
import type { ClasificacionRespuesta, Reply } from "@/lib/types";

export interface ReplyRow extends Reply {
  empresaNombre: string;
  contactoNombre: string;
  campaignNombre: string;
}

const OPCIONES: { value: ClasificacionRespuesta; label: string }[] = [
  { value: "interesado", label: "Interesado" },
  { value: "mas_info", label: "Pide más información" },
  { value: "no_interesado", label: "No interesado" },
  { value: "fuera_de_target", label: "Fuera de target" },
  { value: "no_contactar", label: "No contactar" },
];

const TABS: { value: ClasificacionRespuesta | "todas"; label: string }[] = [
  { value: "todas", label: "Todas" },
  ...OPCIONES,
];

export function ReplyInbox({ replies: initial }: { replies: ReplyRow[] }) {
  const [replies, setReplies] = useState(initial);
  const [tab, setTab] = useState<ClasificacionRespuesta | "todas">("todas");

  const counts = useMemo(() => {
    const c: Record<string, number> = { todas: replies.length };
    for (const o of OPCIONES) c[o.value] = replies.filter((r) => r.clasificacion === o.value).length;
    return c;
  }, [replies]);

  const visibles = replies
    .filter((r) => tab === "todas" || r.clasificacion === tab)
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));

  return (
    <div>
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
            {t.label} ({counts[t.value] ?? 0})
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <EmptyState icon={Inbox} title="Sin respuestas en esta clasificación" />
      ) : (
        <div className="space-y-4">
          {visibles.map((r) => (
            <Card key={r.id}>
              <CardBody className="pt-5">
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <Link href={`/empresas/${r.companyId}`} className="text-sm font-semibold text-ink-900 hover:text-gold-600 dark:text-ink-100 dark:hover:text-gold-400">
                      {r.empresaNombre}
                    </Link>
                    <p className="text-xs text-ink-500 dark:text-ink-500">
                      {r.contactoNombre} · Campaña: {r.campaignNombre} · {formatDate(r.fecha)}
                    </p>
                  </div>
                  <ClasificacionBadge clasificacion={r.clasificacion} />
                </div>

                <p className="rounded-xl bg-ink-50 p-3 text-sm italic text-ink-700 dark:bg-ink-800/50 dark:text-ink-300">
                  &ldquo;{r.textoOriginal}&rdquo;
                </p>
                <p className="mt-2 text-xs text-ink-500 dark:text-ink-500">{r.resumen}</p>

                <div className="mt-3 flex items-center gap-2">
                  <label className="text-xs font-medium text-ink-500 dark:text-ink-500">Reclasificar:</label>
                  <select
                    value={r.clasificacion}
                    onChange={(e) => {
                      const nueva = e.target.value as ClasificacionRespuesta;
                      setReplies((prev) => prev.map((p) => (p.id === r.id ? { ...p, clasificacion: nueva } : p)));
                    }}
                    className="rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 text-xs text-ink-800 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
                  >
                    {OPCIONES.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  {r.clasificacion === "no_contactar" && (
                    <span className="text-xs text-danger-600 dark:text-rose-400">
                      Se añadirá a la lista global de exclusión
                    </span>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
