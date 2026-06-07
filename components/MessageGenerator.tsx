"use client";

import { useState, useTransition } from "react";
import { Wand2, Check, X, Send, Clock } from "lucide-react";
import { StatusBadge } from "@/components/badges";
import { draftStatusLabel } from "@/lib/labels";
import { createDraftAction, setDraftStatusAction } from "@/lib/actions";
import type { Company, Contact, EmailDraft, DraftStatus } from "@/lib/types";

interface Props {
  contacts: Contact[];
  companies: Company[];
  initialDrafts: EmailDraft[];
}

type Tone = "directo" | "consultivo" | "cercano";

// Generación local basada en plantillas (sin integraciones externas).
function buildDraft(contact: Contact, company: Company | undefined, tone: Tone) {
  const firstName = contact.full_name.split(" ")[0];
  const companyName = company?.name ?? "vuestra empresa";
  const sector = company?.sector ?? "vuestro sector";

  const openings: Record<Tone, string> = {
    directo: `Hola ${firstName}, voy al grano:`,
    consultivo: `Hola ${firstName},\n\nEstuve analizando a ${companyName} y vi un punto de mejora claro.`,
    cercano: `Hola ${firstName}, espero que tengas una buena semana.`,
  };

  const subject = `${companyName}: oportunidad en ${sector}`;
  const body =
    `${openings[tone]}\n\n` +
    `Trabajamos con empresas de ${sector} como ${companyName} para captar clientes de mayor ticket ` +
    `(operaciones por encima de 10.000 €) sin ampliar el equipo comercial.\n\n` +
    `Como ${contact.title ?? "responsable"}, imagino que esto te resulta relevante. ` +
    `¿Te viene bien una llamada de 15 minutos esta semana?\n\n` +
    `Un saludo.`;

  return { subject, body };
}

export default function MessageGenerator({ contacts, companies, initialDrafts }: Props) {
  const companyById = new Map(companies.map((c) => [c.id, c]));
  const [contactId, setContactId] = useState(contacts[0]?.id ?? "");
  const [tone, setTone] = useState<Tone>("consultivo");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [drafts, setDrafts] = useState<EmailDraft[]>(initialDrafts);
  const [, startTransition] = useTransition();

  const selected = contacts.find((c) => c.id === contactId);

  function generate() {
    if (!selected) return;
    const company = selected.company_id ? companyById.get(selected.company_id) : undefined;
    const d = buildDraft(selected, company, tone);
    setSubject(d.subject);
    setBody(d.body);
  }

  function sendForApproval() {
    if (!selected || !subject || !body) return;
    const draft: EmailDraft = {
      id: `local-${Date.now()}`,
      organization_id: selected.organization_id,
      contact_id: selected.id,
      campaign_id: null,
      subject,
      body,
      status: "pending_approval",
      approved_by: null,
      approved_at: null,
      created_at: new Date().toISOString(),
    };
    setDrafts((d) => [draft, ...d]);
    setSubject("");
    setBody("");
    startTransition(() => {
      void createDraftAction({ contact_id: selected.id, campaign_id: null, subject, body });
    });
  }

  function setStatus(id: string, status: DraftStatus) {
    setDrafts((ds) =>
      ds.map((d) => (d.id === id ? { ...d, status, approved_at: status === "approved" ? new Date().toISOString() : d.approved_at } : d))
    );
    if (status === "approved" || status === "rejected") {
      startTransition(() => { void setDraftStatusAction(id, status); });
    }
  }

  const contactName = (id: string) => contacts.find((c) => c.id === id)?.full_name ?? "Contacto";
  const pending = drafts.filter((d) => d.status === "pending_approval");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor */}
      <div className="bg-[#0d1428] border border-slate-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-blue-400" /> Generar borrador
        </h2>

        <label className="block text-slate-300 text-sm mb-1.5">Contacto</label>
        <select
          value={contactId}
          onChange={(e) => setContactId(e.target.value)}
          className="w-full bg-[#0a0f1e] border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm mb-4 focus:outline-none focus:border-blue-500"
        >
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name} — {c.title} ({companyById.get(c.company_id ?? "")?.name ?? "—"})
            </option>
          ))}
        </select>

        <label className="block text-slate-300 text-sm mb-1.5">Tono</label>
        <div className="flex gap-2 mb-4">
          {(["directo", "consultivo", "cercano"] as Tone[]).map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-3 py-1.5 rounded-lg text-sm capitalize border ${
                tone === t ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "text-slate-400 border-slate-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={generate}
          className="w-full mb-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90"
        >
          <Wand2 className="w-4 h-4" /> Generar
        </button>

        <label className="block text-slate-300 text-sm mb-1.5">Asunto</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-[#0a0f1e] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm mb-3 focus:outline-none focus:border-blue-500"
          placeholder="El asunto aparecerá aquí…"
        />
        <label className="block text-slate-300 text-sm mb-1.5">Cuerpo</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={9}
          className="w-full bg-[#0a0f1e] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm mb-4 focus:outline-none focus:border-blue-500 resize-none"
          placeholder="El cuerpo del email aparecerá aquí. Puedes editarlo antes de enviarlo a aprobación."
        />

        <button
          onClick={sendForApproval}
          disabled={!subject || !body}
          className="w-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-500/30 disabled:opacity-40"
        >
          <Clock className="w-4 h-4" /> Enviar a aprobación humana
        </button>
      </div>

      {/* Cola de aprobación */}
      <div className="bg-[#0d1428] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Cola de aprobación</h2>
          <span className="text-amber-400 text-xs bg-amber-500/10 border border-amber-500/30 rounded-full px-2.5 py-0.5">
            {pending.length} pendientes
          </span>
        </div>

        <div className="space-y-3 max-h-[560px] overflow-y-auto">
          {drafts.map((d) => (
            <div key={d.id} className="border border-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium">{contactName(d.contact_id)}</span>
                <StatusBadge status={d.status} label={draftStatusLabel[d.status]} />
              </div>
              <div className="text-slate-300 text-sm font-medium mb-1">{d.subject}</div>
              <p className="text-slate-400 text-xs whitespace-pre-line line-clamp-3 mb-3">{d.body}</p>

              {d.status === "pending_approval" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setStatus(d.id, "approved")}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-medium py-1.5 rounded-lg hover:bg-emerald-500/30"
                  >
                    <Check className="w-3.5 h-3.5" /> Aprobar
                  </button>
                  <button
                    onClick={() => setStatus(d.id, "rejected")}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-medium py-1.5 rounded-lg hover:bg-rose-500/30"
                  >
                    <X className="w-3.5 h-3.5" /> Rechazar
                  </button>
                </div>
              )}

              {d.status === "approved" && (
                <button
                  disabled
                  title="Envío real deshabilitado en esta fase"
                  className="w-full flex items-center justify-center gap-1.5 bg-slate-800 text-slate-500 border border-slate-700 text-xs font-medium py-1.5 rounded-lg cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" /> Aprobado · envío pendiente de activar
                </button>
              )}
            </div>
          ))}
          {drafts.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-8">No hay borradores todavía.</p>
          )}
        </div>
      </div>
    </div>
  );
}
