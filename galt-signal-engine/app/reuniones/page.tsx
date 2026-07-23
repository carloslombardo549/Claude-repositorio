import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { ReunionEstadoBadge } from "@/components/ui/domainBadges";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";
import { getCampaign, getCompany, getContact, MOCK } from "@/lib/mock/generate";

export default function ReunionesPage() {
  const reuniones = [...MOCK.meetings].sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  const programadas = reuniones.filter((r) => r.estado === "programada").length;
  const realizadas = reuniones.filter((r) => r.estado === "realizada").length;
  const canceladas = reuniones.filter((r) => r.estado === "cancelada").length;

  return (
    <div>
      <PageHeader
        title="Reuniones"
        description="Reuniones generadas a partir de respuestas interesadas, con su estado y notas de seguimiento."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Programadas" value={String(programadas)} icon={CalendarClock} />
        <StatCard label="Realizadas" value={String(realizadas)} icon={CalendarClock} />
        <StatCard label="Canceladas" value={String(canceladas)} icon={CalendarClock} />
      </div>

      {reuniones.length === 0 ? (
        <EmptyState icon={CalendarClock} title="Todavía no hay reuniones" />
      ) : (
        <div className="space-y-4">
          {reuniones.map((r) => {
            const company = getCompany(r.companyId);
            const contact = getContact(r.contactId);
            const campaign = getCampaign(r.campaignId);
            return (
              <Card key={r.id}>
                <CardBody className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <Link href={`/empresas/${r.companyId}`} className="text-sm font-semibold text-ink-900 hover:text-gold-600 dark:text-ink-100 dark:hover:text-gold-400">
                        {company?.nombre ?? "—"}
                      </Link>
                      <ReunionEstadoBadge estado={r.estado} />
                    </div>
                    <p className="text-xs text-ink-500 dark:text-ink-500">
                      Con {contact?.nombre ?? "—"} ({contact?.cargo ?? "—"}) · Campaña: {campaign?.nombre ?? "—"}
                    </p>
                    <p className="mt-2 text-sm text-ink-600 dark:text-ink-400">{r.notas}</p>
                  </div>
                  <div className="shrink-0 rounded-lg bg-ink-50 px-4 py-2 text-center dark:bg-ink-800/50">
                    <p className="text-xs uppercase tracking-wide text-ink-500 dark:text-ink-500">Fecha</p>
                    <p className="text-sm font-semibold text-ink-800 dark:text-ink-200">{formatDate(r.fecha)}</p>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
