"use client";

import { useState } from "react";
import { Save, Plus, Trash2, ShieldCheck, User, CheckCircle2 } from "lucide-react";
import TagInput from "@/components/TagInput";
import { icpSchema, exclusionSchema } from "@/lib/validation/schemas";
import { exclusionTypeLabel } from "@/lib/labels";
import type { IcpProfile, ExclusionEntry, ExclusionType } from "@/lib/types";

export default function SettingsView({
  icp: initialIcp,
  exclusions: initialExclusions,
}: {
  icp: IcpProfile;
  exclusions: ExclusionEntry[];
}) {
  const [icp, setIcp] = useState(initialIcp);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [exclusions, setExclusions] = useState(initialExclusions);
  const [newType, setNewType] = useState<ExclusionType>("domain");
  const [newValue, setNewValue] = useState("");
  const [newReason, setNewReason] = useState("");

  function saveIcp() {
    const result = icpSchema.safeParse({
      name: icp.name,
      sectors: icp.sectors,
      employee_min: icp.employee_min,
      employee_max: icp.employee_max,
      deal_value_min: icp.deal_value_min,
      geographies: icp.geographies,
      decision_titles: icp.decision_titles,
      notes: icp.notes,
    });
    if (!result.success) {
      setErrors(result.error.issues.map((i) => i.message));
      return;
    }
    setErrors([]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function addExclusion() {
    const result = exclusionSchema.safeParse({ type: newType, value: newValue, reason: newReason || null });
    if (!result.success) return;
    setExclusions((e) => [
      {
        id: `local-${Date.now()}`,
        organization_id: icp.organization_id,
        type: newType,
        value: newValue.trim(),
        reason: newReason || null,
        created_at: new Date().toISOString(),
      },
      ...e,
    ]);
    setNewValue("");
    setNewReason("");
  }

  return (
    <div className="space-y-8">
      {/* ICP */}
      <section className="bg-[#0d1428] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-semibold">Perfil de Cliente Ideal (ICP)</h2>
            <p className="text-slate-400 text-sm mt-0.5">Define el encaje. Las empresas se clasifican A/B/C contra estos criterios.</p>
          </div>
          <button onClick={saveIcp} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-sm font-medium rounded-lg hover:opacity-90">
            <Save className="w-4 h-4" /> Guardar
          </button>
        </div>

        {saved && (
          <div className="mb-4 flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
            <CheckCircle2 className="w-4 h-4" /> ICP validado y guardado (demo: sin persistencia sin Supabase).
          </div>
        )}
        {errors.length > 0 && (
          <div className="mb-4 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/30 rounded-lg p-3">
            {errors.map((e, i) => <div key={i}>{e}</div>)}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Nombre del perfil</label>
            <input
              value={icp.name}
              onChange={(e) => setIcp({ ...icp, name: e.target.value })}
              className="w-full bg-[#0a0f1e] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Ticket mínimo (€)</label>
            <input
              type="number"
              value={icp.deal_value_min}
              onChange={(e) => setIcp({ ...icp, deal_value_min: Number(e.target.value) })}
              className="w-full bg-[#0a0f1e] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Empleados (mínimo)</label>
            <input
              type="number"
              value={icp.employee_min ?? ""}
              onChange={(e) => setIcp({ ...icp, employee_min: e.target.value ? Number(e.target.value) : null })}
              className="w-full bg-[#0a0f1e] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Empleados (máximo)</label>
            <input
              type="number"
              value={icp.employee_max ?? ""}
              onChange={(e) => setIcp({ ...icp, employee_max: e.target.value ? Number(e.target.value) : null })}
              className="w-full bg-[#0a0f1e] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <TagInput label="Sectores objetivo" value={icp.sectors} onChange={(v) => setIcp({ ...icp, sectors: v })} placeholder="Manufactura, Logística…" />
          <TagInput label="Geografías" value={icp.geographies} onChange={(v) => setIcp({ ...icp, geographies: v })} placeholder="España, México…" />
          <div className="md:col-span-2">
            <TagInput label="Cargos de decisor" value={icp.decision_titles} onChange={(v) => setIcp({ ...icp, decision_titles: v })} placeholder="CEO, CFO, Director de Operaciones…" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Notas</label>
            <textarea
              value={icp.notes ?? ""}
              onChange={(e) => setIcp({ ...icp, notes: e.target.value })}
              rows={3}
              className="w-full bg-[#0a0f1e] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>
      </section>

      {/* Lista de exclusión */}
      <section className="bg-[#0d1428] border border-slate-800 rounded-xl p-6">
        <h2 className="text-white font-semibold">Lista de exclusión / no contactar</h2>
        <p className="text-slate-400 text-sm mt-0.5 mb-5">Emails, dominios o empresas que nunca deben ser contactados. Se aplican en la importación.</p>

        <div className="flex gap-2 mb-5 flex-wrap">
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as ExclusionType)}
            className="bg-[#0a0f1e] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="domain">Dominio</option>
            <option value="email">Email</option>
            <option value="company">Empresa</option>
          </select>
          <input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="competidor.com"
            className="flex-1 min-w-[160px] bg-[#0a0f1e] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <input
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            placeholder="Motivo (opcional)"
            className="flex-1 min-w-[160px] bg-[#0a0f1e] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <button onClick={addExclusion} disabled={!newValue.trim()} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 hover:bg-slate-700 disabled:opacity-40">
            <Plus className="w-4 h-4" /> Añadir
          </button>
        </div>

        <div className="border border-slate-800 rounded-lg divide-y divide-slate-800">
          {exclusions.map((ex) => (
            <div key={ex.id} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-400 bg-slate-800 rounded px-2 py-0.5">{exclusionTypeLabel[ex.type]}</span>
                <span className="text-white text-sm">{ex.value}</span>
                {ex.reason && <span className="text-slate-500 text-xs">— {ex.reason}</span>}
              </div>
              <button onClick={() => setExclusions((e) => e.filter((x) => x.id !== ex.id))} className="text-slate-500 hover:text-rose-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {exclusions.length === 0 && <div className="p-4 text-slate-500 text-sm text-center">Lista vacía.</div>}
        </div>
      </section>

      {/* Roles */}
      <section className="bg-[#0d1428] border border-slate-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-5">Roles y accesos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm font-medium">Administrador de agencia</span>
            </div>
            <p className="text-slate-400 text-sm">Acceso a todas las organizaciones cliente, configuración de ICP, campañas y aprobación de mensajes.</p>
          </div>
          <div className="border border-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span className="text-white text-sm font-medium">Usuario cliente</span>
            </div>
            <p className="text-slate-400 text-sm">Acceso únicamente a los datos de su propia organización (aplicado con Row Level Security en Supabase).</p>
          </div>
        </div>
      </section>
    </div>
  );
}
