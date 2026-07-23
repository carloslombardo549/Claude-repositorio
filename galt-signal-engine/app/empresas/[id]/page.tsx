import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Ban, Globe, MapPin } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { EstadoBadge, ScoreBadge, TipoSenalBadge } from "@/components/ui/domainBadges";
import { Badge } from "@/components/ui/Badge";
import { ScoreBreakdownBars } from "@/components/empresas/ScoreBreakdownBars";
import { MessageGeneratorCard } from "@/components/empresas/MessageGeneratorCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users } from "lucide-react";
import {
  contactsForCompany,
  getCompany,
  getDossier,
  messagesForCompany,
  signalsForCompany,
} from "@/lib/mock/generate";
import { formatDate, formatEur, formatEurM } from "@/lib/format";

const MADUREZ_LABEL = { baja: "Baja", media: "Media", alta: "Alta" } as const;

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = getCompany(id);
  if (!company) notFound();

  const signals = signalsForCompany(id);
  const contacts = contactsForCompany(id);
  const dossier = getDossier(id);
  const [message] = messagesForCompany(id);
  const decisor = contacts.find((c) => c.esDecisor);

  return (
    <div>
      <Link
        href="/empresas"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a empresas objetivo
      </Link>

      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-ink-200/70 bg-white p-6 shadow-[var(--shadow-card)] dark:border-ink-800 dark:bg-ink-900 dark:shadow-[var(--shadow-card-dark)] sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">{company.nombre}</h1>
            <EstadoBadge estado={company.estado} />
            {company.excluida && <Badge tone="danger">Excluida</Badge>}
            {company.noContactar && (
              <Badge tone="danger">
                <Ban className="h-3 w-3" /> No contactar
              </Badge>
            )}
          </div>
          <p className="max-w-2xl text-sm text-ink-500 dark:text-ink-400">{company.descripcion}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-500 dark:text-ink-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {company.ciudad}, {company.provincia}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" /> {company.web}
            </span>
            <span>CIF {company.cif}</span>
            <span>Fundada en {company.fundada}</span>
          </div>
          {company.excluida && company.motivoExclusion && (
            <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              Motivo de exclusión: {company.motivoExclusion}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <ScoreBadge score={company.score.total} />
          <p className="mt-1 text-xs text-ink-400 dark:text-ink-500">Puntuación ICP (0-100)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Datos clave</CardTitle>
          </CardHeader>
          <CardBody className="space-y-2.5 text-sm">
            <Row label="Sector" value={company.sector} />
            <Row label="Empleados" value={`${company.empleados}`} />
            <Row label="Facturación anual" value={formatEurM(company.facturacionEurM)} />
            <Row label="Ticket medio" value={formatEur(company.ticketMedioEur)} />
            <Row label="Madurez en automatización/IA" value={MADUREZ_LABEL[company.madurezAutomatizacion]} />
            <Row label="Decisor involucrado en ventas" value={company.decisorInvolucrado ? "Sí" : "No"} />
            <Row label="Detectada el" value={formatDate(company.fechaDeteccion)} />
            <Row label="Origen del dato" value={company.origenDato} small />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Desglose de la puntuación</CardTitle>
          </CardHeader>
          <CardBody>
            <ScoreBreakdownBars score={company.score} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contactos y decisores</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {contacts.length === 0 ? (
              <EmptyState icon={Users} title="Sin contactos identificados" />
            ) : (
              contacts.map((c) => (
                <div key={c.id} className="rounded-lg border border-ink-100 p-3 dark:border-ink-800">
                  <div className="mb-0.5 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-ink-900 dark:text-ink-100">{c.nombre}</p>
                    {c.esDecisor && <Badge tone="gold">Decisor</Badge>}
                  </div>
                  <p className="text-xs text-ink-500 dark:text-ink-500">{c.cargo}</p>
                  {c.noContactar ? (
                    <p className="mt-1 text-xs font-medium text-danger-600 dark:text-rose-400">No contactar</p>
                  ) : (
                    <p className="mt-1 text-xs text-ink-400 dark:text-ink-500">{c.email}</p>
                  )}
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Señales detectadas ({signals.length})</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            {signals.length === 0 ? (
              <p className="text-sm text-ink-500 dark:text-ink-500">No se han detectado señales verificables.</p>
            ) : (
              signals.map((s) => (
                <div key={s.id} className="border-b border-ink-100 pb-4 last:border-0 last:pb-0 dark:border-ink-800/60">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <TipoSenalBadge tipo={s.tipo} />
                    <span className="text-xs text-ink-400 dark:text-ink-500">{formatDate(s.fuenteFecha)}</span>
                  </div>
                  <p className="text-sm font-medium text-ink-800 dark:text-ink-200">{s.descripcion}</p>
                  <p className="mt-1 text-xs text-ink-500 dark:text-ink-500">
                    Fuente: {s.fuenteBase} ·{" "}
                    <a href={s.fuenteUrl} target="_blank" rel="noreferrer" className="text-gold-700 hover:underline dark:text-gold-400">
                      {s.fuenteUrl}
                    </a>
                  </p>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dossier de investigación</CardTitle>
          </CardHeader>
          <CardBody>
            {!dossier ? (
              <p className="text-sm text-ink-500 dark:text-ink-500">
                No hay evidencia suficiente para construir un dossier de investigación.
              </p>
            ) : (
              <div className="space-y-4 text-sm">
                <p className="text-ink-700 dark:text-ink-300">{dossier.resumen}</p>
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-500">
                    Inferencias (prudentes, no confirmadas)
                  </p>
                  <ul className="space-y-1.5">
                    {dossier.inferencias.map((inf, i) => (
                      <li key={i} className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                        {inf.texto}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-500">Fuentes</p>
                  <ul className="space-y-1 text-xs text-ink-500 dark:text-ink-500">
                    {dossier.fuentes.map((f, i) => (
                      <li key={i}>
                        <a href={f.url} target="_blank" rel="noreferrer" className="text-gold-700 hover:underline dark:text-gold-400">
                          {f.url}
                        </a>{" "}
                        — {formatDate(f.fecha)} ({f.base})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="mt-6">
        <MessageGeneratorCard message={message} contactoNombre={decisor?.nombre} />
      </div>
    </div>
  );
}

function Row({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-ink-500 dark:text-ink-500">{label}</span>
      <span className={small ? "max-w-[60%] text-right text-xs text-ink-500 dark:text-ink-500" : "font-medium text-ink-800 dark:text-ink-200"}>
        {value}
      </span>
    </div>
  );
}
