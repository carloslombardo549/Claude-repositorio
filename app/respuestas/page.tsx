import MainLayout from "@/components/MainLayout";
import PageHeader from "@/components/PageHeader";
import { StatusBadge } from "@/components/badges";
import { getMessages, getContacts, getCompanies } from "@/lib/data";
import { sentimentLabel } from "@/lib/labels";

export default async function RespuestasPage() {
  const [messages, contacts, companies] = await Promise.all([
    getMessages(), getContacts(), getCompanies(),
  ]);
  const contactById = new Map(contacts.map((c) => [c.id, c]));
  const companyById = new Map(companies.map((c) => [c.id, c]));
  const replies = messages.filter((m) => m.kind === "reply");

  const counts = {
    positive: replies.filter((r) => r.sentiment === "positive").length,
    neutral: replies.filter((r) => r.sentiment === "neutral").length,
    negative: replies.filter((r) => r.sentiment === "negative").length,
  };

  return (
    <MainLayout>
      <div className="p-8">
        <PageHeader
          title="Bandeja de respuestas"
          subtitle={`${replies.length} respuestas · ${counts.positive} positivas · ${counts.neutral} neutrales · ${counts.negative} negativas`}
        />

        <div className="space-y-3">
          {replies.map((m) => {
            const contact = contactById.get(m.contact_id);
            const company = contact?.company_id ? companyById.get(contact.company_id) : null;
            return (
              <div key={m.id} className="bg-[#0d1428] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-white text-sm font-medium">{contact?.full_name ?? "Contacto"}</span>
                    <span className="text-slate-500 text-xs ml-2">{company?.name} · {contact?.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={m.sentiment} label={sentimentLabel[m.sentiment]} />
                    <span className="text-slate-500 text-xs">
                      {new Date(m.occurred_at).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
                <div className="text-slate-300 text-sm font-medium">{m.subject}</div>
                <p className="text-slate-400 text-sm mt-1">{m.body}</p>
              </div>
            );
          })}
          {replies.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-12">No hay respuestas todavía.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
