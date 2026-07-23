import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Funnel } from "@/components/charts/Funnel";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { DownloadReportButton } from "@/components/informes/DownloadReportButton";
import {
  funnelSteps,
  globalStats,
  segmentPerformance,
  signalPerformance,
  weeklyTrend,
} from "@/lib/aggregates";
import { formatDate, formatPercent } from "@/lib/format";
import { TIPO_SENAL_LABEL } from "@/lib/scoring";
import { MOCK } from "@/lib/mock/generate";
import { BarChart3, CalendarClock, TrendingUp, Users } from "lucide-react";

export default function InformesPage() {
  const stats = globalStats();
  const funnel = funnelSteps();
  const trend = weeklyTrend();
  const segmentos = segmentPerformance();
  const señales = signalPerformance();

  const reporte = buildReportText();

  return (
    <div>
      <PageHeader
        title="Informes"
        description="Informe semanal del sistema de captación: qué segmentos y mensajes funcionan mejor."
        actions={<DownloadReportButton contenido={reporte} fileName="galt-signal-engine-informe-semanal.txt" />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Empresas prioridad alta" value={String(stats.prioridadAlta)} icon={Users} />
        <StatCard label="Tasa de respuesta" value={formatPercent(stats.tasaRespuesta)} icon={TrendingUp} />
        <StatCard label="Tasa respuesta → reunión" value={formatPercent(stats.tasaReunion)} icon={BarChart3} />
        <StatCard label="Reuniones realizadas" value={String(stats.reunionesRealizadas)} icon={CalendarClock} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolución semanal</CardTitle>
          </CardHeader>
          <CardBody>
            <TrendLineChart
              data={trend}
              lines={[
                { key: "detectadas", color: "#b98b3e", label: "Empresas detectadas" },
                { key: "mensajes", color: "#1f9d6b", label: "Mensajes generados" },
                { key: "respuestas", color: "#3b82f6", label: "Respuestas" },
                { key: "reuniones", color: "#d3564a", label: "Reuniones" },
              ]}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Embudo acumulado</CardTitle>
          </CardHeader>
          <CardBody>
            <Funnel steps={funnel} />
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Segmentos con mejor respuesta</CardTitle>
          </CardHeader>
          <CardBody className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-500 dark:border-ink-800 dark:text-ink-500">
                  <th className="pb-2 font-medium">Sector</th>
                  <th className="pb-2 font-medium">Enviados</th>
                  <th className="pb-2 font-medium">Interesados</th>
                  <th className="pb-2 font-medium">Tasa</th>
                </tr>
              </thead>
              <tbody>
                {segmentos.map((s) => (
                  <tr key={s.sector} className="border-b border-ink-100 last:border-0 dark:border-ink-800/60">
                    <td className="py-2 text-ink-700 dark:text-ink-300">{s.sector}</td>
                    <td className="py-2 text-ink-600 dark:text-ink-400">{s.enviados}</td>
                    <td className="py-2 text-ink-600 dark:text-ink-400">{s.interesados}</td>
                    <td className="py-2 font-medium text-ink-800 dark:text-ink-200">{formatPercent(s.tasaRespuesta)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Señales que generan más interés</CardTitle>
          </CardHeader>
          <CardBody className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-500 dark:border-ink-800 dark:text-ink-500">
                  <th className="pb-2 font-medium">Tipo de señal</th>
                  <th className="pb-2 font-medium">Mensajes</th>
                  <th className="pb-2 font-medium">Interesados</th>
                </tr>
              </thead>
              <tbody>
                {señales.map((s) => (
                  <tr key={s.tipo} className="border-b border-ink-100 last:border-0 dark:border-ink-800/60">
                    <td className="py-2 text-ink-700 dark:text-ink-300">{TIPO_SENAL_LABEL[s.tipo]}</td>
                    <td className="py-2 text-ink-600 dark:text-ink-400">{s.mensajes}</td>
                    <td className="py-2 font-medium text-ink-800 dark:text-ink-200">{s.interesados}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function buildReportText(): string {
  const stats = globalStats();
  const segmentos = segmentPerformance();
  const fecha = formatDate(MOCK.now.toISOString());
  const lineas = [
    "GALT SIGNAL ENGINE — INFORME SEMANAL",
    `Fecha del informe: ${fecha}`,
    "Datos simulados con fines de demostración.",
    "",
    "RESUMEN",
    `- Empresas en prioridad alta: ${stats.prioridadAlta}`,
    `- Mensajes pendientes de aprobación: ${stats.mensajesPendientes}`,
    `- Tasa de respuesta: ${stats.tasaRespuesta.toFixed(1)}%`,
    `- Reuniones realizadas: ${stats.reunionesRealizadas} · programadas: ${stats.reunionesProgramadas}`,
    "",
    "SEGMENTOS CON MEJOR RESPUESTA",
    ...segmentos.map((s) => `- ${s.sector}: ${s.enviados} enviados, ${s.interesados} interesados (${s.tasaRespuesta.toFixed(1)}%)`),
    "",
    "Generado por Galt Signal Engine — fase demo, datos simulados.",
  ];
  return lineas.join("\n");
}
