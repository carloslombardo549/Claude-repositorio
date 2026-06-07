"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { campaignSchema } from "@/lib/validation/schemas";
import { createCampaignAction } from "@/lib/actions";

export default function NewCampaignButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", description: "", channel: "email", start_date: "", end_date: "",
  });

  function submit() {
    const result = campaignSchema.safeParse({
      ...form,
      description: form.description || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await createCampaignAction(result.data);
      if (!res.ok) {
        setError(res.error ?? "No se pudo crear");
        return;
      }
      setOpen(false);
      setForm({ name: "", description: "", channel: "email", start_date: "", end_date: "" });
      if (!res.demo) router.refresh();
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-sm font-medium rounded-lg hover:opacity-90"
      >
        <Plus className="w-4 h-4" /> Nueva campaña
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#0d1428] border border-slate-800 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h2 className="text-white font-semibold">Nueva campaña</h2>
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <Field label="Nombre">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input"
                  placeholder="Manufactura Q3 2026"
                />
              </Field>
              <Field label="Descripción">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="input resize-none"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Inicio">
                  <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="input" />
                </Field>
                <Field label="Fin">
                  <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="input" />
                </Field>
              </div>
              {error && <p className="text-rose-400 text-sm">{error}</p>}
            </div>
            <div className="p-5 border-t border-slate-800 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-4 py-2 text-slate-300 text-sm hover:text-white">Cancelar</button>
              <button
                onClick={submit}
                disabled={pending || !form.name}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-sm font-medium rounded-lg disabled:opacity-50"
              >
                {pending ? "Creando…" : "Crear campaña"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(.input) {
          width: 100%;
          background: #0a0f1e;
          border: 1px solid #334155;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          color: white;
          font-size: 0.875rem;
        }
        :global(.input:focus) {
          outline: none;
          border-color: #3b82f6;
        }
      `}</style>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-slate-300 text-sm font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}
