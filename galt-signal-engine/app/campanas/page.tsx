import { ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { CampaignCard } from "@/components/campanas/CampaignCard";
import { MOCK } from "@/lib/mock/generate";

export default function CampanasPage() {
  return (
    <div>
      <PageHeader
        title="Campañas"
        description="Agrupaciones de empresas objetivo por segmento. El envío sigue siendo manual y aprobado por una persona en todos los casos."
      />

      <Card className="mb-6 border-ink-300 bg-ink-50 dark:border-ink-700 dark:bg-ink-800/40">
        <CardBody className="flex items-start gap-3 pt-5">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-ink-500 dark:text-ink-400" />
          <p className="text-sm text-ink-600 dark:text-ink-400">
            Por diseño, ninguna campaña puede activar el envío automático desde esta interfaz en la fase actual. Todo
            mensaje se aprueba individualmente en la Cola de aprobación antes de enviarse.
          </p>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {MOCK.campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            companies={campaign.companyIds
              .map((id) => MOCK.companies.find((c) => c.id === id))
              .filter((c): c is (typeof MOCK.companies)[number] => Boolean(c))}
          />
        ))}
      </div>
    </div>
  );
}
