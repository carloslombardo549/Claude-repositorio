import MainLayout from "@/components/MainLayout";
import PageHeader from "@/components/PageHeader";
import { StatusBadge } from "@/components/badges";
import { Linkedin, Mail, Star } from "lucide-react";
import { getContacts, getCompanies } from "@/lib/data";
import { contactStatusLabel } from "@/lib/labels";

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

export default async function ContactosPage() {
  const [contacts, companies] = await Promise.all([getContacts(), getCompanies()]);
  const companyById = new Map(companies.map((c) => [c.id, c]));

  const decisionMakers = contacts.filter((c) => c.is_decision_maker).length;

  return (
    <MainLayout>
      <div className="p-8">
        <PageHeader
          title="Contactos"
          subtitle={`${contacts.length} contactos · ${decisionMakers} decisores identificados`}
        />

        <div className="bg-[#0d1428] border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-slate-400 text-xs font-medium p-3">Contacto</th>
                  <th className="text-left text-slate-400 text-xs font-medium p-3">Cargo</th>
                  <th className="text-left text-slate-400 text-xs font-medium p-3">Empresa</th>
                  <th className="text-left text-slate-400 text-xs font-medium p-3">Canales</th>
                  <th className="text-left text-slate-400 text-xs font-medium p-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => {
                  const company = c.company_id ? companyById.get(c.company_id) : null;
                  return (
                    <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 border border-slate-700 flex items-center justify-center text-white text-xs font-bold">
                            {initials(c.full_name)}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium flex items-center gap-1.5">
                              {c.full_name}
                              {c.is_decision_maker && (
                                <span title="Decisor"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /></span>
                              )}
                            </div>
                            <div className="text-slate-500 text-xs">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-slate-300 text-sm">{c.title}</td>
                      <td className="p-3 text-slate-300 text-sm">{company?.name ?? "—"}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2 text-slate-500">
                          {c.email && <Mail className="w-4 h-4 hover:text-blue-400" />}
                          {c.linkedin_url && <Linkedin className="w-4 h-4 hover:text-blue-400" />}
                        </div>
                      </td>
                      <td className="p-3"><StatusBadge status={c.status} label={contactStatusLabel[c.status]} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
