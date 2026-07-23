"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { EstadoBadge, ScoreBadge, TipoSenalBadge } from "@/components/ui/domainBadges";
import { EmptyState } from "@/components/ui/EmptyState";
import { Building2 } from "lucide-react";
import { formatEurM } from "@/lib/format";
import type { Company, Estado, TipoSenal } from "@/lib/types";
import { TIPO_SENAL_LABEL } from "@/lib/scoring";

export interface CompanyRow extends Company {
  tiposSenal: TipoSenal[];
}

const ESTADOS: { value: Estado | "todos"; label: string }[] = [
  { value: "todos", label: "Todos los estados" },
  { value: "prioridad_alta", label: "Prioridad alta" },
  { value: "seguimiento", label: "Seguimiento" },
  { value: "descartado", label: "Descartado temporalmente" },
];

export function EmpresasExplorer({
  companies,
  sectores,
  ciudades,
  tiposSenal,
}: {
  companies: CompanyRow[];
  sectores: string[];
  ciudades: string[];
  tiposSenal: TipoSenal[];
}) {
  const [busqueda, setBusqueda] = useState("");
  const [sector, setSector] = useState("todos");
  const [ciudad, setCiudad] = useState("todos");
  const [estado, setEstado] = useState<Estado | "todos">("todos");
  const [senal, setSenal] = useState<TipoSenal | "todos">("todos");
  const [incluirExcluidas, setIncluirExcluidas] = useState(false);

  const filtradas = useMemo(() => {
    return companies
      .filter((c) => incluirExcluidas || !c.excluida)
      .filter((c) => sector === "todos" || c.sector === sector)
      .filter((c) => ciudad === "todos" || c.ciudad === ciudad)
      .filter((c) => estado === "todos" || c.estado === estado)
      .filter((c) => senal === "todos" || c.tiposSenal.includes(senal))
      .filter((c) => busqueda.trim() === "" || c.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()))
      .sort((a, b) => b.score.total - a.score.total);
  }, [companies, sector, ciudad, estado, senal, busqueda, incluirExcluidas]);

  return (
    <div>
      <Card className="mb-6">
        <CardBody className="grid grid-cols-1 gap-3 pt-5 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre de empresa…"
              className="w-full rounded-lg border border-ink-200 bg-white py-2 pl-9 pr-3 text-sm text-ink-800 placeholder:text-ink-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:focus:ring-gold-900/40"
            />
          </div>
          <Select value={sector} onChange={setSector} options={["todos", ...sectores]} labelForTodos="Todos los sectores" />
          <Select value={ciudad} onChange={setCiudad} options={["todos", ...ciudades]} labelForTodos="Todas las ciudades" />
          <Select
            value={estado}
            onChange={(v) => setEstado(v as Estado | "todos")}
            options={ESTADOS.map((e) => e.value)}
            labelMap={Object.fromEntries(ESTADOS.map((e) => [e.value, e.label]))}
          />
          <Select
            value={senal}
            onChange={(v) => setSenal(v as TipoSenal | "todos")}
            options={["todos", ...tiposSenal]}
            labelMap={{ todos: "Todas las señales", ...TIPO_SENAL_LABEL }}
          />
          <label className="flex items-center gap-2 text-xs font-medium text-ink-600 dark:text-ink-400 lg:col-span-5">
            <input
              type="checkbox"
              checked={incluirExcluidas}
              onChange={(e) => setIncluirExcluidas(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-ink-300 text-gold-600 focus:ring-gold-400"
            />
            Incluir empresas excluidas (fuera de ICP o marcadas como &quot;no contactar&quot;)
          </label>
        </CardBody>
      </Card>

      <p className="mb-3 text-xs text-ink-500 dark:text-ink-500">
        {filtradas.length} empresa{filtradas.length === 1 ? "" : "s"} encontrada{filtradas.length === 1 ? "" : "s"}
      </p>

      {filtradas.length === 0 ? (
        <EmptyState icon={Building2} title="Sin resultados" description="Ajusta los filtros para ver más empresas." />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-500 dark:border-ink-800 dark:text-ink-500">
                <th className="px-5 py-3 font-medium">Empresa</th>
                <th className="px-3 py-3 font-medium">Sector</th>
                <th className="px-3 py-3 font-medium">Ciudad</th>
                <th className="px-3 py-3 font-medium">Tamaño</th>
                <th className="px-3 py-3 font-medium">Señales</th>
                <th className="px-3 py-3 font-medium">Score</th>
                <th className="px-3 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((c) => (
                <tr key={c.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/70 dark:border-ink-800/60 dark:hover:bg-ink-800/40">
                  <td className="px-5 py-3">
                    <Link href={`/empresas/${c.id}`} className="font-medium text-ink-900 hover:text-gold-600 dark:text-ink-100 dark:hover:text-gold-400">
                      {c.nombre}
                    </Link>
                    {c.excluida && (
                      <p className="mt-0.5 text-xs text-danger-600 dark:text-rose-400">Excluida: {c.motivoExclusion}</p>
                    )}
                  </td>
                  <td className="px-3 py-3 text-ink-600 dark:text-ink-400">{c.sector}</td>
                  <td className="px-3 py-3 text-ink-600 dark:text-ink-400">{c.ciudad}</td>
                  <td className="px-3 py-3 text-ink-600 dark:text-ink-400">
                    {c.empleados} emp. · {formatEurM(c.facturacionEurM)}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.tiposSenal.slice(0, 2).map((t) => (
                        <TipoSenalBadge key={t} tipo={t} />
                      ))}
                      {c.tiposSenal.length > 2 && (
                        <span className="text-xs text-ink-400 dark:text-ink-500">+{c.tiposSenal.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <ScoreBadge score={c.score.total} />
                  </td>
                  <td className="px-3 py-3">
                    <EstadoBadge estado={c.estado} />
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

function Select({
  value,
  onChange,
  options,
  labelForTodos,
  labelMap,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  labelForTodos?: string;
  labelMap?: Record<string, string>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:focus:ring-gold-900/40"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt === "todos" ? labelForTodos ?? labelMap?.todos ?? "Todos" : labelMap?.[opt] ?? opt}
        </option>
      ))}
    </select>
  );
}
