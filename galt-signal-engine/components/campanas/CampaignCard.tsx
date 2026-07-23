import Link from "next/link";
import { Lock } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { formatDate, formatPercent } from "@/lib/format";
import type { Campaign, Company } from "@/lib/types";

const ESTADO_TONE: Record<Campaign["estado"], BadgeTone> = {
  activa: "success",
  pausada: "warning",
  finalizada: "neutral",
};

const ESTADO_LABEL: Record<Campaign["estado"], string> = {
  activa: "Activa",
  pausada: "Pausada",
  finalizada: "Finalizada",
};

export function CampaignCard({ campaign, companies }: { campaign: Campaign; companies: Company[] }) {
  const tasaRespuesta = campaign.mensajesEnviados > 0 ? (campaign.respuestasRecibidas / campaign.mensajesEnviados) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{campaign.nombre}</CardTitle>
          <p className="mt-1 text-xs text-ink-500 dark:text-ink-500">{campaign.segmento}</p>
        </div>
        <Badge tone={ESTADO_TONE[campaign.estado]}>{ESTADO_LABEL[campaign.estado]}</Badge>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-ink-600 dark:text-ink-400">{campaign.descripcion}</p>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <Metric label="Enviados" value={String(campaign.mensajesEnviados)} />
          <Metric label="Respuestas" value={String(campaign.respuestasRecibidas)} />
          <Metric label="Reuniones" value={String(campaign.reunionesGeneradas)} />
        </div>

        <p className="mt-3 text-xs text-ink-500 dark:text-ink-500">
          Tasa de respuesta: <span className="font-medium text-ink-700 dark:text-ink-300">{formatPercent(tasaRespuesta)}</span> ·
          Inicio: {formatDate(campaign.fechaInicio)}
        </p>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-ink-200 bg-ink-50 px-3 py-2.5 dark:border-ink-800 dark:bg-ink-800/40">
          <span className="flex items-center gap-2 text-xs font-medium text-ink-600 dark:text-ink-400">
            <Lock className="h-3.5 w-3.5" />
            Envío automático
          </span>
          <span
            className="relative inline-flex h-5 w-9 items-center rounded-full bg-ink-300 dark:bg-ink-700"
            title="El envío automático está desactivado en esta fase y no puede activarse desde la interfaz."
          >
            <span className="inline-block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow" />
          </span>
        </div>

        <details className="mt-4 text-sm">
          <summary className="cursor-pointer font-medium text-ink-600 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100">
            Empresas en esta campaña ({companies.length})
          </summary>
          <ul className="mt-2 space-y-1.5">
            {companies.map((c) => (
              <li key={c.id}>
                <Link href={`/empresas/${c.id}`} className="text-ink-700 hover:text-gold-600 dark:text-ink-300 dark:hover:text-gold-400">
                  {c.nombre}
                </Link>
                <span className="ml-1.5 text-xs text-ink-400 dark:text-ink-500">{c.ciudad}</span>
              </li>
            ))}
          </ul>
        </details>
      </CardBody>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ink-50 py-2.5 dark:bg-ink-800/40">
      <p className="text-lg font-semibold text-ink-900 dark:text-ink-100">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-ink-500 dark:text-ink-500">{label}</p>
    </div>
  );
}
