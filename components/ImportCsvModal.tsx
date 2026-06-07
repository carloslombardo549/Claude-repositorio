"use client";

import { useState, useTransition } from "react";
import Papa from "papaparse";
import { X, UploadCloud, CheckCircle2, AlertTriangle, Ban } from "lucide-react";
import { normalizeApolloRow, fullName, isExcluded, type NormalizedRow } from "@/lib/csv";
import type { ExclusionEntry, IcpProfile } from "@/lib/types";
import type { ApolloRow } from "@/lib/validation/schemas";
import { scoreCompany } from "@/lib/scoring";
import { importApolloAction } from "@/lib/actions";

interface Props {
  open: boolean;
  onClose: () => void;
  icp: IcpProfile;
  exclusions: ExclusionEntry[];
}

interface PreviewRow {
  name: string;
  company: string;
  title: string;
  email: string;
  grade: string;
  score: number;
  excluded: boolean;
  errors: string[];
  data: ApolloRow | null;
}

export default function ImportCsvModal({ open, onClose, icp, exclusions }: Props) {
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [done, setDone] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [pending, startTransition] = useTransition();

  if (!open) return null;

  function handleFile(file: File) {
    setFileName(file.name);
    setDone(false);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const preview: PreviewRow[] = result.data.map((raw, i) => {
          const norm: NormalizedRow = normalizeApolloRow(raw, i);
          const d = norm.data;
          const domain = d?.website?.replace(/^https?:\/\//, "").replace(/\/.*$/, "") || undefined;
          const excluded = d
            ? isExcluded(d.email || undefined, domain, d.company || undefined, exclusions)
            : false;
          const { score, grade } = d
            ? scoreCompany(
                { sector: d.industry, employees: d.employees ?? null, country: d.country, domain: domain ?? null },
                icp,
                [{ title: d.title, is_decision_maker: false }]
              )
            : { score: 0, grade: "C" as const };
          return {
            name: d ? fullName(d) : "—",
            company: d?.company || "—",
            title: d?.title || "—",
            email: d?.email || "—",
            grade,
            score,
            excluded,
            errors: norm.errors,
            data: d,
          };
        });
        setRows(preview);
      },
    });
  }

  const valid = rows.filter((r) => r.errors.length === 0 && !r.excluded);
  const blocked = rows.filter((r) => r.excluded);
  const invalid = rows.filter((r) => r.errors.length > 0);

  function commit() {
    const payload = valid.map((r) => r.data).filter((d): d is ApolloRow => d !== null);
    startTransition(async () => {
      const res = await importApolloAction(payload);
      setImportedCount(res.inserted ?? payload.length);
      setDone(true);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[#0d1428] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div>
            <h2 className="text-white font-semibold">Importar desde Apollo (CSV)</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              Se valida cada fila, se clasifica A/B/C y se filtra la lista de exclusión.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          {rows.length === 0 ? (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl py-12 cursor-pointer hover:border-blue-500/50 transition-colors">
              <UploadCloud className="w-10 h-10 text-slate-500 mb-3" />
              <span className="text-slate-300 text-sm font-medium">Selecciona el CSV exportado de Apollo</span>
              <span className="text-slate-500 text-xs mt-1">Cabeceras reconocidas: First Name, Last Name, Title, Company, Email…</span>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </label>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4 text-sm flex-wrap">
                <span className="text-slate-400">{fileName}</span>
                <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-4 h-4" /> {valid.length} válidos</span>
                <span className="flex items-center gap-1 text-amber-400"><Ban className="w-4 h-4" /> {blocked.length} excluidos</span>
                <span className="flex items-center gap-1 text-rose-400"><AlertTriangle className="w-4 h-4" /> {invalid.length} con errores</span>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-800/30">
                      <th className="text-left text-slate-400 text-xs font-medium p-2.5">Contacto</th>
                      <th className="text-left text-slate-400 text-xs font-medium p-2.5">Empresa</th>
                      <th className="text-left text-slate-400 text-xs font-medium p-2.5">Email</th>
                      <th className="text-center text-slate-400 text-xs font-medium p-2.5">Encaje</th>
                      <th className="text-left text-slate-400 text-xs font-medium p-2.5">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 100).map((r, i) => (
                      <tr key={i} className="border-b border-slate-800/50">
                        <td className="p-2.5 text-slate-200">{r.name}<div className="text-slate-500 text-xs">{r.title}</div></td>
                        <td className="p-2.5 text-slate-300">{r.company}</td>
                        <td className="p-2.5 text-slate-400 text-xs">{r.email}</td>
                        <td className="p-2.5 text-center">
                          <span className={`font-bold ${r.grade === "A" ? "text-emerald-400" : r.grade === "B" ? "text-amber-400" : "text-slate-400"}`}>
                            {r.grade} · {r.score}
                          </span>
                        </td>
                        <td className="p-2.5">
                          {r.errors.length > 0 ? (
                            <span className="text-rose-400 text-xs">{r.errors[0]}</span>
                          ) : r.excluded ? (
                            <span className="text-amber-400 text-xs">Excluido (no contactar)</span>
                          ) : (
                            <span className="text-emerald-400 text-xs">Listo para importar</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {done && (
            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
              <CheckCircle2 className="w-4 h-4" />
              {importedCount} contactos procesados. Con Supabase configurado se guardan en la base de datos; en modo demo no se persisten.
            </div>
          )}
        </div>

        {rows.length > 0 && (
          <div className="p-5 border-t border-slate-800 flex justify-end gap-2">
            <button onClick={() => { setRows([]); setDone(false); setImportedCount(0); }} className="px-4 py-2 text-slate-300 text-sm hover:text-white">
              Elegir otro archivo
            </button>
            <button
              onClick={commit}
              disabled={valid.length === 0 || done || pending}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-sm font-medium rounded-lg disabled:opacity-50"
            >
              {pending ? "Importando…" : `Importar ${valid.length} contactos`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
