import { Lock, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ExclusionList } from "@/components/configuracion/ExclusionList";
import { MOCK } from "@/lib/mock/generate";

const FLAGS_SEGURIDAD = [
  {
    titulo: "Automatización o scraping de LinkedIn",
    estado: "Desactivado permanentemente",
    detalle: "Ningún flujo de Galt Signal Engine automatiza acciones ni extrae datos de LinkedIn.",
  },
  {
    titulo: "Envío automático de mensajes",
    estado: "Desactivado por defecto",
    detalle: "No existe ningún control en esta fase para activar el envío sin aprobación humana.",
  },
  {
    titulo: "Aprobación humana obligatoria",
    estado: "Activado permanentemente",
    detalle: "Todo mensaje generado debe pasar por la Cola de aprobación antes de considerarse enviado.",
  },
  {
    titulo: "Registro de origen y fecha del dato",
    estado: "Activado permanentemente",
    detalle: "Empresas, contactos y señales declaran siempre su fuente, fecha y base del dato.",
  },
];

const INTEGRACIONES = [
  { nombre: "Supabase / PostgreSQL", uso: "Persistencia de datos y autenticación", variable: "NEXT_PUBLIC_SUPABASE_URL" },
  { nombre: "Inngest", uso: "Ejecución programada del radar de señales", variable: "INNGEST_EVENT_KEY" },
  { nombre: "Apollo.io", uso: "Enriquecimiento de empresas y decisores", variable: "APOLLO_API_KEY" },
  { nombre: "Anthropic", uso: "Generación de mensajes personalizados", variable: "ANTHROPIC_API_KEY" },
  { nombre: "Proveedor de email", uso: "Envío y tracking de secuencias", variable: "EMAIL_PROVIDER_API_KEY" },
];

const ICP = [
  "Empresas B2B españolas",
  "Entre 5 y 50 empleados",
  "Entre 1 y 20 millones de € de facturación",
  "Consultoras, agencias, software houses y servicios B2B de ticket alto",
  "Proyectos o contratos superiores a 10.000 €",
  "Founder, CEO o socio todavía involucrado en ventas",
  "Baja madurez en automatización e IA",
];

const EXCLUIDOS = [
  "B2C de bajo ticket",
  "Restaurantes",
  "Clínicas pequeñas",
  "Administraciones públicas",
  "Grandes corporaciones",
  "Sectores excesivamente regulados",
];

export default function ConfiguracionPage() {
  return (
    <div>
      <PageHeader title="Configuración" description="Reglas de cumplimiento, integraciones y criterios del ICP de Galt Capital." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Seguridad y cumplimiento</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {FLAGS_SEGURIDAD.map((f) => (
              <div key={f.titulo} className="flex items-start justify-between gap-3 rounded-lg border border-ink-100 p-3 dark:border-ink-800">
                <div>
                  <p className="text-sm font-medium text-ink-900 dark:text-ink-100">{f.titulo}</p>
                  <p className="text-xs text-ink-500 dark:text-ink-500">{f.detalle}</p>
                </div>
                <Badge tone="success" className="shrink-0">
                  <Lock className="h-3 w-3" />
                  {f.estado}
                </Badge>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integraciones (fase 2)</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {INTEGRACIONES.map((i) => (
              <div key={i.nombre} className="flex items-start justify-between gap-3 rounded-lg border border-ink-100 p-3 dark:border-ink-800">
                <div>
                  <p className="text-sm font-medium text-ink-900 dark:text-ink-100">{i.nombre}</p>
                  <p className="text-xs text-ink-500 dark:text-ink-500">{i.uso}</p>
                  <p className="text-xs text-ink-400 dark:text-ink-600">Variable: {i.variable}</p>
                </div>
                <Badge tone="neutral" className="shrink-0">
                  No configurada
                </Badge>
              </div>
            ))}
            <p className="text-xs text-ink-400 dark:text-ink-500">
              Copia <code className="rounded bg-ink-100 px-1 py-0.5 dark:bg-ink-800">.env.example</code> a{" "}
              <code className="rounded bg-ink-100 px-1 py-0.5 dark:bg-ink-800">.env.local</code> y añade tus claves
              reales cuando conectes estas integraciones. Nunca se versionan claves reales.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cliente ideal (ICP)</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-500">Incluye</p>
              <ul className="space-y-1 text-sm text-ink-700 dark:text-ink-300">
                {ICP.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success-500" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-500">Excluye</p>
              <ul className="space-y-1 text-sm text-ink-500 dark:text-ink-500">
                {EXCLUIDOS.map((i) => (
                  <li key={i}>— {i}</li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cuenta</CardTitle>
          </CardHeader>
          <CardBody className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink-500 dark:text-ink-500">Organización</span>
              <span className="font-medium text-ink-800 dark:text-ink-200">Galt Capital</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-500 dark:text-ink-500">Entorno</span>
              <Badge tone="warning">Demo · datos simulados</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-500 dark:text-ink-500">Empresas gestionadas</span>
              <span className="font-medium text-ink-800 dark:text-ink-200">{MOCK.companies.length}</span>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-ink-900 dark:text-ink-100">Lista global de exclusión</h2>
        <ExclusionList entries={MOCK.exclusions} />
      </div>
    </div>
  );
}
