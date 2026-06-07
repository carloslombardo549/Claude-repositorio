"use client";

import { useMemo, useState } from "react";
import { Upload, Search } from "lucide-react";
import { GradeBadge, StatusBadge } from "@/components/badges";
import ImportCsvModal from "@/components/ImportCsvModal";
import { companyStatusLabel } from "@/lib/labels";
import type { Company, ExclusionEntry, IcpProfile } from "@/lib/types";

export default function CompaniesView({
  companies,
  icp,
  exclusions,
}: {
  companies: Company[];
  icp: IcpProfile;
  exclusions: ExclusionEntry[];
}) {
  const [grade, setGrade] = useState<"all" | "A" | "B" | "C">("all");
  const [q, setQ] = useState("");
  const [importOpen, setImportOpen] = useState(false);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const matchesGrade = grade === "all" || c.grade === grade;
      const matchesQ =
        q === "" ||
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        (c.sector ?? "").toLowerCase().includes(q.toLowerCase());
      return matchesGrade && matchesQ;
    });
  }, [companies, grade, q]);

  const counts = {
    all: companies.length,
    A: companies.filter((c) => c.grade === "A").length,
    B: companies.filter((c) => c.grade === "B").length,
    C: companies.filter((c) => c.grade === "C").length,
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {(["all", "A", "B", "C"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGrade(g)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                grade === g
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  : "text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
              }`}
            >
              {g === "all" ? "Todas" : `Grado ${g}`} <span className="text-slate-500">({counts[g]})</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar empresa o sector…"
              className="bg-[#0d1428] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 w-56"
            />
          </div>
          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-sm font-medium rounded-lg hover:opacity-90"
          >
            <Upload className="w-4 h-4" /> Importar CSV
          </button>
        </div>
      </div>

      <div className="bg-[#0d1428] border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-center text-slate-400 text-xs font-medium p-3 w-16">Grado</th>
                <th className="text-left text-slate-400 text-xs font-medium p-3">Empresa</th>
                <th className="text-left text-slate-400 text-xs font-medium p-3">Sector</th>
                <th className="text-left text-slate-400 text-xs font-medium p-3">Tamaño</th>
                <th className="text-left text-slate-400 text-xs font-medium p-3">País</th>
                <th className="text-right text-slate-400 text-xs font-medium p-3">Encaje</th>
                <th className="text-left text-slate-400 text-xs font-medium p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <td className="p-3 text-center"><GradeBadge grade={c.grade} /></td>
                  <td className="p-3">
                    <div className="text-white text-sm font-medium">{c.name}</div>
                    <div className="text-slate-500 text-xs">{c.domain}</div>
                  </td>
                  <td className="p-3 text-slate-300 text-sm">{c.sector}</td>
                  <td className="p-3 text-slate-300 text-sm">{c.size_label} emp.</td>
                  <td className="p-3 text-slate-300 text-sm">{c.country}</td>
                  <td className="p-3 text-right">
                    <span className="text-blue-400 text-sm font-semibold">{c.fit_score}</span>
                    <span className="text-slate-600 text-xs">/100</span>
                  </td>
                  <td className="p-3"><StatusBadge status={c.status} label={companyStatusLabel[c.status]} /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-slate-500 text-sm">Sin resultados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ImportCsvModal open={importOpen} onClose={() => setImportOpen(false)} icp={icp} exclusions={exclusions} />
    </>
  );
}
