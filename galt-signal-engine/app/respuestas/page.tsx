import { PageHeader } from "@/components/ui/PageHeader";
import { ReplyInbox, type ReplyRow } from "@/components/respuestas/ReplyInbox";
import { getCampaign, getCompany, getContact, MOCK } from "@/lib/mock/generate";

export default function RespuestasPage() {
  const rows: ReplyRow[] = MOCK.replies.map((r) => ({
    ...r,
    empresaNombre: getCompany(r.companyId)?.nombre ?? "—",
    contactoNombre: getContact(r.contactId)?.nombre ?? "—",
    campaignNombre: getCampaign(r.campaignId)?.nombre ?? "—",
  }));

  return (
    <div>
      <PageHeader
        title="Bandeja de respuestas"
        description="Respuestas recibidas a los mensajes enviados, clasificadas para decidir el siguiente paso."
      />
      <ReplyInbox replies={rows} />
    </div>
  );
}
