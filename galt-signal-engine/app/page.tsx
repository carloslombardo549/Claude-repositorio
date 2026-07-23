import Link from "next/link";
import { Building2, CalendarClock, ClipboardCheck, Radar, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EstadoBadge, ScoreBadge, TipoSenalBadge } from "@/components/ui/domainBadges";
import { EstadoDonut } from "@/components/charts/EstadoDonut";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { Funnel } from "@/components/charts/Funnel";
import { estadoDistribution, funnelSteps, globalStats, signalTypeDistribution, topCompanies } from "@/lib/aggregates";
import { formatEurM, relativeDays } from "@/lib/format";
import { MOCK } from "@/lib/mock/generate";

export default function DashboardPage() {
  const stats = globalStats();
  const top = topCompanies(5);
  const estadoData = estadoDistribution();
  const signalData = signalTypeDistribution().slice(0, 6);
  const funnel = funnelSteps();
  const ultimasSenales = [...MOCK.signals].sort((a, b) => (a.fechaDeteccion < b.fechaDeteccion ? 1 : -1)).slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Panorama general del sistema de captación B2B: empresas detectadas, señales, aprobaciones y reuniones."
        actions={
          <Link href="/radar">
            <Button variant="primary">
              <Radar className="h-4 w-4" />
              Ejecutar radar
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Empresas prioridad alta"
          value={String(stats.prioridadAlta)}
          icon={Building2}
          hint={`de ${MOCK.companies.filter((c) => !c.excluida).length} empresas activas en el radar`}
        />
        <StatCard
          label="Mensajes en cola de aprobación"
          value={String(stats.mensajesPendientes)}
          icon={ClipboardCheck}
          hint="Pendientes de revisión humana"
        />
        <StatCard
          label="Tasa de respuesta"
          value={`${stats.tasaRespuesta.toFixed(1)} %`}
          icon={TrendingUp}
          hint={`${stats.totalRespuestas} respuestas sobre ${stats.totalEnviados} mensajes enviados`}
        />
        <StatCard
          label="Reuniones"
          value={String(stats.reunionesProgramadas + stats.reunionesRealizadas)}
          icon={CalendarClock}
          hint={`${stats.reunionesRealizadas} realizadas · ${stats.reunionesProgramadas} programadas`}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Embudo: de empresa detectada a reunión</CardTitle>
          </CardHeader>
          <CardBody>
            <Funnel steps={funnel} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Empresas por estado</CardTitle>
          </CardHeader>
          <CardBody>
            <EstadoDonut data={estadoData} />
            <div className="mt-2 flex flex-col gap-1.5">
              {estadoData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-ink-600 dark:text-ink-400">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name}
                  </span>
                  <span className="font-medium text-ink-800 dark:text-ink-200">{d.value}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Empresas prioritarias esta semana</CardTitle>
          </CardHeader>
          <CardBody className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-500 dark:border-ink-800 dark:text-ink-500">
                  <th className="pb-2 font-medium">Empresa</th>
                  <th className="pb-2 font-medium">Sector</th>
                  <th className="pb-2 font-medium">Score</th>
                  <th className="pb-2 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {top.map((c) => (
                  <tr key={c.id} className="border-b border-ink-100 last:border-0 dark:border-ink-800/60">
                    <td className="py-2.5">
                      <Link href={`/empresas/${c.id}`} className="font-medium text-ink-900 hover:text-gold-600 dark:text-ink-100 dark:hover:text-gold-400">
                        {c.nombre}
                      </Link>
                      <p className="text-xs text-ink-500 dark:text-ink-500">
                        {c.ciudad} · {formatEurM(c.facturacionEurM)}
                      </p>
                    </td>
                    <td className="py-2.5 text-ink-600 dark:text-ink-400">{c.sector}</td>
                    <td className="py-2.5">
                      <ScoreBadge score={c.score.total} />
                    </td>
                    <td className="py-2.5">
                      <EstadoBadge estado={c.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas señales detectadas</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            {ultimasSenales.map((s) => {
              const company = MOCK.companies.find((c) => c.id === s.companyId);
              return (
                <div key={s.id} className="border-b border-ink-100 pb-3 last:border-0 last:pb-0 dark:border-ink-800/60">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <TipoSenalBadge tipo={s.tipo} />
                    <span className="text-xs text-ink-400 dark:text-ink-500">{relativeDays(s.fechaDeteccion, MOCK.now)}</span>
                  </div>
                  <p className="text-sm font-medium text-ink-800 dark:text-ink-200">{company?.nombre}</p>
                  <p className="text-xs text-ink-500 dark:text-ink-500">{s.titulo}</p>
                </div>
              );
            })}
          </CardBody>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Tipos de señal más frecuentes</CardTitle>
          </CardHeader>
          <CardBody>
            <HorizontalBarChart data={signalData} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
