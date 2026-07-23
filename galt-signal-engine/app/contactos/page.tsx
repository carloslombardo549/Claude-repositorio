import { PageHeader } from "@/components/ui/PageHeader";
import { ContactosExplorer, type ContactRow } from "@/components/contactos/ContactosExplorer";
import { MOCK } from "@/lib/mock/generate";

export default function ContactosPage() {
  const rows: ContactRow[] = MOCK.contacts.map((c) => {
    const empresa = MOCK.companies.find((e) => e.id === c.companyId);
    return { ...c, empresaNombre: empresa?.nombre ?? "—", sector: empresa?.sector ?? "—" };
  });
  const sectores = [...new Set(rows.map((r) => r.sector))].sort();

  return (
    <div>
      <PageHeader
        title="Contactos y decisores"
        description="Founders, CEOs, socios y responsables comerciales identificados en las empresas objetivo, sin automatización ni scraping de LinkedIn."
      />
      <ContactosExplorer contacts={rows} sectores={sectores} />
    </div>
  );
}
