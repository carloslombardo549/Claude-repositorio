"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Users } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Contact } from "@/lib/types";
import { formatDate } from "@/lib/format";

export interface ContactRow extends Contact {
  empresaNombre: string;
  sector: string;
}

export function ContactosExplorer({ contacts, sectores }: { contacts: ContactRow[]; sectores: string[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [sector, setSector] = useState("todos");
  const [soloDecisores, setSoloDecisores] = useState(false);
  const [ocultarNoContactar, setOcultarNoContactar] = useState(false);

  const filtrados = useMemo(() => {
    return contacts
      .filter((c) => sector === "todos" || c.sector === sector)
      .filter((c) => !soloDecisores || c.esDecisor)
      .filter((c) => !ocultarNoContactar || !c.noContactar)
      .filter(
        (c) =>
          busqueda.trim() === "" ||
          c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          c.empresaNombre.toLowerCase().includes(busqueda.toLowerCase()),
      )
      .sort((a, b) => Number(b.esDecisor) - Number(a.esDecisor));
  }, [contacts, sector, soloDecisores, ocultarNoContactar, busqueda]);

  return (
    <div>
      <Card className="mb-6">
        <CardBody className="grid grid-cols-1 gap-3 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por contacto o empresa…"
              className="w-full rounded-lg border border-ink-200 bg-white py-2 pl-9 pr-3 text-sm text-ink-800 placeholder:text-ink-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
            />
          </div>
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
          <div className="flex items-center gap-4 text-xs font-medium text-ink-600 dark:text-ink-400">
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={soloDecisores} onChange={(e) => setSoloDecisores(e.target.checked)} className="h-3.5 w-3.5 rounded border-ink-300 text-gold-600 focus:ring-gold-400" />
              Solo decisores
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={ocultarNoContactar}
                onChange={(e) => setOcultarNoContactar(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-ink-300 text-gold-600 focus:ring-gold-400"
              />
              Ocultar &quot;no contactar&quot;
            </label>
          </div>
        </CardBody>
      </Card>

      <p className="mb-3 text-xs text-ink-500 dark:text-ink-500">
        {filtrados.length} contacto{filtrados.length === 1 ? "" : "s"} encontrado{filtrados.length === 1 ? "" : "s"}
      </p>

      {filtrados.length === 0 ? (
        <EmptyState icon={Users} title="Sin resultados" description="Ajusta los filtros para ver más contactos." />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-500 dark:border-ink-800 dark:text-ink-500">
                <th className="px-5 py-3 font-medium">Contacto</th>
                <th className="px-3 py-3 font-medium">Empresa</th>
                <th className="px-3 py-3 font-medium">Contacto directo</th>
                <th className="px-3 py-3 font-medium">Origen del dato</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((c) => (
                <tr key={c.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/70 dark:border-ink-800/60 dark:hover:bg-ink-800/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-ink-900 dark:text-ink-100">{c.nombre}</p>
                      {c.esDecisor && <Badge tone="gold">Decisor</Badge>}
                      {c.noContactar && <Badge tone="danger">No contactar</Badge>}
                    </div>
                    <p className="text-xs text-ink-500 dark:text-ink-500">{c.cargo}</p>
                  </td>
                  <td className="px-3 py-3">
                    <Link href={`/empresas/${c.companyId}`} className="text-ink-700 hover:text-gold-600 dark:text-ink-300 dark:hover:text-gold-400">
                      {c.empresaNombre}
                    </Link>
                    <p className="text-xs text-ink-500 dark:text-ink-500">{c.sector}</p>
                  </td>
                  <td className="px-3 py-3 text-ink-600 dark:text-ink-400">
                    {c.noContactar ? (
                      <span className="text-danger-600 dark:text-rose-400">Contacto bloqueado</span>
                    ) : (
                      <>
                        <p>{c.email}</p>
                        <p className="text-xs text-ink-400 dark:text-ink-500">{c.telefono}</p>
                      </>
                    )}
                  </td>
                  <td className="px-3 py-3 text-xs text-ink-500 dark:text-ink-500">
                    {c.fuenteDato}
                    <br />
                    Detectado el {formatDate(c.fechaDeteccion)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
