import MainLayout from "@/components/MainLayout";
import PageHeader from "@/components/PageHeader";
import { StatusBadge } from "@/components/badges";
import { CalendarClock } from "lucide-react";
import { getMeetings, getContacts, getCompanies } from "@/lib/data";
import { meetingStatusLabel } from "@/lib/labels";

function fmt(dt: string) {
  return new Date(dt).toLocaleString("es-ES", {
    weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
  });
}

export default async function ReunionesPage() {
  const [meetings, contacts, companies] = await Promise.all([
    getMeetings(), getContacts(), getCompanies(),
  ]);
  const contactById = new Map(contacts.map((c) => [c.id, c]));
  const companyById = new Map(companies.map((c) => [c.id, c]));

  const upcoming = meetings.filter((m) => m.status === "scheduled");
  const past = meetings.filter((m) => m.status !== "scheduled");

  function render(list: typeof meetings) {
    return list.map((m) => {
      const contact = contactById.get(m.contact_id);
      const company = m.company_id ? companyById.get(m.company_id) : null;
      return (
        <div key={m.id} className="bg-[#0d1428] border border-slate-800 rounded-xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
            <CalendarClock className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium">{contact?.full_name ?? "Contacto"}</span>
              <StatusBadge status={m.status} label={meetingStatusLabel[m.status]} />
            </div>
            <div className="text-slate-500 text-xs">{company?.name} · {contact?.title}</div>
            <div className="text-slate-300 text-sm mt-2 capitalize">{fmt(m.scheduled_at)}</div>
            {m.notes && <p className="text-slate-400 text-sm mt-1">{m.notes}</p>}
          </div>
        </div>
      );
    });
  }

  return (
    <MainLayout>
      <div className="p-8">
        <PageHeader
          title="Reuniones"
          subtitle={`${upcoming.length} próximas · ${past.length} pasadas`}
        />

        <h2 className="text-slate-400 text-sm font-medium mb-3">Próximas</h2>
        <div className="space-y-3 mb-8">
          {render(upcoming)}
          {upcoming.length === 0 && <p className="text-slate-500 text-sm">Sin reuniones próximas.</p>}
        </div>

        <h2 className="text-slate-400 text-sm font-medium mb-3">Pasadas</h2>
        <div className="space-y-3">
          {render(past)}
          {past.length === 0 && <p className="text-slate-500 text-sm">Sin reuniones pasadas.</p>}
        </div>
      </div>
    </MainLayout>
  );
}
