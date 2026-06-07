import MainLayout from "@/components/MainLayout";
import PageHeader from "@/components/PageHeader";
import MessageGenerator from "@/components/MessageGenerator";
import { getContacts, getCompanies, getDrafts } from "@/lib/data";

export default async function GeneradorPage() {
  const [contacts, companies, drafts] = await Promise.all([
    getContacts(), getCompanies(), getDrafts(),
  ]);

  return (
    <MainLayout>
      <div className="p-8">
        <PageHeader
          title="Generador de mensajes"
          subtitle="Crea borradores personalizados. Ningún email se envía sin aprobación humana."
        />
        <MessageGenerator contacts={contacts} companies={companies} initialDrafts={drafts} />
      </div>
    </MainLayout>
  );
}
