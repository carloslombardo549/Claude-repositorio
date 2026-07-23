import { PageHeader } from "@/components/ui/PageHeader";
import { ApprovalQueue, type QueueItem } from "@/components/aprobacion/ApprovalQueue";
import { getCompany, getContact, getSignal, MOCK } from "@/lib/mock/generate";

export default function AprobacionPage() {
  const items: QueueItem[] = MOCK.messages.map((message) => {
    const company = getCompany(message.companyId);
    const contact = getContact(message.contactId);
    const signal = getSignal(message.signalId);
    return {
      message,
      empresaNombre: company?.nombre ?? "—",
      empresaId: message.companyId,
      contactoNombre: contact?.nombre ?? "—",
      contactoCargo: contact?.cargo ?? "—",
      signal,
    };
  });

  return (
    <div>
      <PageHeader
        title="Cola de aprobación"
        description="Revisa, edita, aprueba o rechaza cada mensaje personalizado antes de que pueda enviarse."
      />
      <ApprovalQueue items={items} />
    </div>
  );
}
