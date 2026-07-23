import type {
  Campaign,
  ClasificacionRespuesta,
  Company,
  Contact,
  Dossier,
  EstadoMensaje,
  EstadoReunion,
  ExclusionEntry,
  Meeting,
  Message,
  Reply,
  Signal,
  TipoSenal,
} from "../types";
import { calcularScore, estadoFromScore } from "../scoring";
import { BASE_NOW, Rng } from "../prng";
import { COMPANY_BASE } from "./companyBaseData";
import { APELLIDOS, CARGOS_DECISOR, CARGOS_NO_DECISOR, NOMBRES } from "./nameData";
import { buildSignalTemplate, TODOS_TIPOS_SENAL } from "./signalTemplates";
import { buildMessageBody, CTA_FIJO } from "./messageTemplates";
import { pad, slugify } from "./util";

const rng = new Rng(20260723);

function isoDaysAgo(maxDays: number, minDays = 0): string {
  return rng.daysAgo(maxDays, minDays).toISOString();
}

// --- Empresas -------------------------------------------------------------

const companies: Company[] = COMPANY_BASE.map((base, idx) => {
  const id = `emp-${pad(idx + 1, 2)}`;
  const cifLetra = "BCDEFGHJ"[idx % 8];
  const cif = `${cifLetra}${pad(10000000 + idx * 137931, 8).slice(-8)}`;
  return {
    id,
    nombre: base.nombre,
    cif,
    sector: base.sector,
    ciudad: base.ciudad,
    provincia: base.provincia,
    empleados: base.empleados,
    facturacionEurM: base.facturacionEurM,
    web: base.web,
    descripcion: base.descripcion,
    fundada: base.fundada,
    decisorInvolucrado: base.decisorInvolucrado,
    madurezAutomatizacion: base.madurezAutomatizacion,
    ticketMedioEur: base.ticketMedioEur,
    fechaDeteccion: isoDaysAgo(120, 5),
    origenDato: "Directorio empresarial simulado + enriquecimiento de radar (dato simulado)",
    score: { icpFit: 0, senalNecesidad: 0, problemaComercial: 0, accesibilidadDecisor: 0, total: 0 },
    estado: "descartado",
    excluida: Boolean(base.excluida),
    motivoExclusion: base.motivoExclusion,
    noContactar: Boolean(base.noContactar),
    signalIds: [],
    contactIds: [],
  };
});

const companyById = new Map(companies.map((c) => [c.id, c]));

// --- Señales (objetivo: 50) -------------------------------------------------

const signals: Signal[] = [];
let signalCounter = 0;

function nextSignalId(): string {
  signalCounter += 1;
  return `sig-${pad(signalCounter, 3)}`;
}

// Empresas elegibles para señales: todas salvo las excluidas explícitamente.
const empresasElegiblesParaSenales = companies.filter((c) => !c.excluida);

// Reparte 50 señales: 1-3 por empresa elegible, ajustado al final a exactamente 50.
const conteoSenalesPorEmpresa = new Map<string, number>();
for (const c of empresasElegiblesParaSenales) {
  conteoSenalesPorEmpresa.set(c.id, rng.int(1, 3));
}

function totalSenalesPlanificadas(): number {
  return [...conteoSenalesPorEmpresa.values()].reduce((a, b) => a + b, 0);
}

// Ajuste determinista al total exacto de 50 señales.
{
  const ids = empresasElegiblesParaSenales.map((c) => c.id);
  let i = 0;
  while (totalSenalesPlanificadas() < 50) {
    const id = ids[i % ids.length] as string;
    conteoSenalesPorEmpresa.set(id, (conteoSenalesPorEmpresa.get(id) ?? 0) + 1);
    i += 1;
  }
  i = 0;
  while (totalSenalesPlanificadas() > 50) {
    const id = ids[i % ids.length] as string;
    const actual = conteoSenalesPorEmpresa.get(id) ?? 0;
    if (actual > 1) conteoSenalesPorEmpresa.set(id, actual - 1);
    i += 1;
  }
}

for (const company of empresasElegiblesParaSenales) {
  const cuantas = conteoSenalesPorEmpresa.get(company.id) ?? 0;
  const tipos = rng.pickMany(TODOS_TIPOS_SENAL, cuantas);
  const slug = slugify(company.nombre);
  for (const tipo of tipos as TipoSenal[]) {
    const tpl = buildSignalTemplate(
      tipo,
      { nombre: company.nombre, slug, ciudad: company.ciudad, sector: company.sector, web: company.web },
      (items) => rng.pick(items),
    );
    const fechaDeteccion = isoDaysAgo(90, 2);
    const signal: Signal = {
      id: nextSignalId(),
      companyId: company.id,
      tipo,
      titulo: tpl.titulo,
      descripcion: tpl.descripcion,
      fuenteUrl: tpl.fuenteUrl,
      fuenteFecha: isoDaysAgo(110, 10),
      fuenteBase: tpl.fuenteBase,
      fuerza: tpl.fuerza,
      fechaDeteccion,
    };
    signals.push(signal);
    company.signalIds.push(signal.id);
  }
}

const signalById = new Map(signals.map((s) => [s.id, s]));

// --- Contactos (objetivo: 45) ----------------------------------------------

const contacts: Contact[] = [];
let contactCounter = 0;

function nextContactId(): string {
  contactCounter += 1;
  return `con-${pad(contactCounter, 3)}`;
}

function makeContact(company: Company, esDecisor: boolean): Contact {
  const nombre = `${rng.pick(NOMBRES)} ${rng.pick(APELLIDOS)}`;
  const cargo = esDecisor ? rng.pick(CARGOS_DECISOR) : rng.pick(CARGOS_NO_DECISOR);
  const slugNombre = slugify(nombre);
  const noContactar = company.noContactar || rng.bool(0.04);
  return {
    id: nextContactId(),
    companyId: company.id,
    nombre,
    cargo,
    esDecisor,
    email: `${slugNombre.replace("-", ".")}@${company.web}`,
    telefono: `+34 6${rng.int(10000000, 99999999)}`,
    linkedinUrl: `https://www.linkedin.com/in/${slugNombre}-demo`,
    fuenteDato: "Directorio profesional público (dato simulado, sin scraping de LinkedIn)",
    fechaDeteccion: isoDaysAgo(100, 3),
    noContactar,
  };
}

// 1 contacto garantizado por empresa (30), 15 contactos adicionales
// repartidos entre empresas no excluidas para llegar a 45.
for (const company of companies) {
  const contacto = makeContact(company, company.decisorInvolucrado && !company.excluida);
  contacts.push(contacto);
  company.contactIds.push(contacto.id);
}

{
  const candidatas = companies.filter((c) => !c.excluida);
  let extra = 15;
  let i = 0;
  while (extra > 0) {
    const company = candidatas[i % candidatas.length] as Company;
    const contacto = makeContact(company, false);
    contacts.push(contacto);
    company.contactIds.push(contacto.id);
    extra -= 1;
    i += 1;
  }
}

const contactById = new Map(contacts.map((c) => [c.id, c]));

// --- Scoring ----------------------------------------------------------------

for (const company of companies) {
  const companySignals = company.signalIds.map((id) => signalById.get(id)).filter((s): s is Signal => Boolean(s));
  const hayContactoDirecto = company.contactIds
    .map((id) => contactById.get(id))
    .some((c) => c?.esDecisor && !c.noContactar);

  if (company.excluida) {
    company.score = { icpFit: 0, senalNecesidad: 0, problemaComercial: 0, accesibilidadDecisor: 0, total: 0 };
    company.estado = "descartado";
    continue;
  }

  const score = calcularScore(
    {
      sector: company.sector,
      empleados: company.empleados,
      facturacionEurM: company.facturacionEurM,
      ticketMedioEur: company.ticketMedioEur,
      decisorInvolucrado: company.decisorInvolucrado,
      madurezAutomatizacion: company.madurezAutomatizacion,
    },
    companySignals,
    hayContactoDirecto,
  );
  company.score = score;
  company.estado = estadoFromScore(score.total);
}

// --- Dossiers ----------------------------------------------------------------

const dossierByCompanyId = new Map<string, Dossier>();

for (const company of companies) {
  if (company.excluida || company.signalIds.length === 0) continue;
  const companySignals = company.signalIds.map((id) => signalById.get(id)).filter((s): s is Signal => Boolean(s));
  const principal = companySignals.reduce((a, b) => (a.fuerza >= b.fuerza ? a : b));
  const dossier: Dossier = {
    companyId: company.id,
    resumen: `${company.nombre} (${company.sector}, ${company.ciudad}) presenta ${companySignals.length} señal(es) pública(s) relevante(s) en los últimos meses. La señal más significativa es: "${principal.titulo}".`,
    senalesClaveIds: companySignals.map((s) => s.id),
    inferencias: companySignals.map((s) => ({
      texto: `Inferencia prudente, no confirmada: en base a "${s.titulo.toLowerCase()}", ${company.nombre} ${signalInferenceText(s.tipo)}.`,
      prudente: true as const,
    })),
    fuentes: companySignals.map((s) => ({ url: s.fuenteUrl, fecha: s.fuenteFecha, base: s.fuenteBase })),
  };
  dossierByCompanyId.set(company.id, dossier);
}

function signalInferenceText(tipo: TipoSenal): string {
  const map: Record<TipoSenal, string> = {
    contratacion_comercial: "podría estar reforzando su capacidad de captación comercial",
    lanzamiento_servicio: "podría necesitar generar demanda para el servicio recién lanzado",
    expansion: "podría necesitar abrir cartera de clientes en el nuevo mercado",
    nueva_vertical: "podría estar validando el encaje comercial de la nueva línea de negocio",
    cambio_direccion_comercial: "podría estar revisando su proceso comercial",
    caso_exito: "podría estar buscando replicar ese resultado con cuentas similares",
    rediseno_web: "podría estar revisando su posicionamiento comercial",
    necesidad_reuniones: "podría tener dificultades para generar reuniones cualificadas de forma predecible",
  };
  return map[tipo];
}

// --- Mensajes (cola de aprobación) ------------------------------------------

const messages: Message[] = [];
let messageCounter = 0;
function nextMessageId(): string {
  messageCounter += 1;
  return `msg-${pad(messageCounter, 3)}`;
}

const ESTADOS_CICLO: EstadoMensaje[] = [
  "pendiente_aprobacion",
  "enviado",
  "aprobado",
  "pendiente_aprobacion",
  "enviado",
  "rechazado",
  "pendiente_aprobacion",
  "enviado",
  "aprobado",
  "enviado",
];

let cicloIdx = 0;

for (const company of companies) {
  if (company.excluida || company.noContactar) continue;
  const dossier = dossierByCompanyId.get(company.id);
  if (!dossier) continue;
  const decisor = company.contactIds
    .map((id) => contactById.get(id))
    .find((c): c is Contact => Boolean(c) && Boolean(c?.esDecisor) && !c?.noContactar);
  if (!decisor) continue;

  const señal = signalById.get(dossier.senalesClaveIds[0] as string);
  if (!señal) continue;

  const estado = ESTADOS_CICLO[cicloIdx % ESTADOS_CICLO.length] as EstadoMensaje;
  cicloIdx += 1;

  const creadoEn = isoDaysAgo(60, 3);
  const message: Message = {
    id: nextMessageId(),
    companyId: company.id,
    contactId: decisor.id,
    signalId: señal.id,
    cuerpo: buildMessageBody({
      contactoNombre: decisor.nombre,
      empresaNombre: company.nombre,
      señalDescripcion: señal.descripcion,
      fuenteUrl: señal.fuenteUrl,
      fuenteFechaFormateada: new Date(señal.fuenteFecha).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      tipo: señal.tipo,
    }),
    cta: CTA_FIJO,
    estado,
    creadoEn,
    editadoPor: estado === "aprobado" || estado === "enviado" ? "Equipo Galt Capital" : undefined,
    fechaAprobacion: estado === "aprobado" || estado === "enviado" ? isoDaysAgo(30, 1) : undefined,
    fechaRechazo: estado === "rechazado" ? isoDaysAgo(20, 1) : undefined,
    motivoRechazo:
      estado === "rechazado" ? "Señal demasiado débil para justificar el contacto en este momento." : undefined,
  };
  messages.push(message);
}

// --- Campañas ----------------------------------------------------------------

const enviados = messages.filter((m) => m.estado === "enviado");

const SECTORES_SOFTWARE = new Set(["Software house"]);
const enviadosSoftware = enviados.filter((m) => SECTORES_SOFTWARE.has(companyById.get(m.companyId)?.sector ?? ""));
const enviadosCambioComercial = enviados.filter((m) => {
  const s = signalById.get(m.signalId);
  return s?.tipo === "cambio_direccion_comercial" || s?.tipo === "contratacion_comercial";
});
// mensajesEnviados es un acumulado histórico de la campaña (semanas de envíos
// aprobados), independiente del pequeño snapshot "enviado" que vive ahora
// mismo en la cola de aprobación. respuestasRecibidas/reunionesGeneradas sí
// se recalculan más abajo a partir de las 15 respuestas y 5 reuniones reales.
const SECTORES_CONSULTORIA_AGENCIA = new Set([
  "Consultoría de gestión",
  "Consultoría tecnológica",
  "Agencia de marketing",
  "Agencia de comunicación",
]);

const campaigns: Campaign[] = [
  {
    id: "cam-01",
    nombre: "Consultoras y agencias — Q3 2026",
    segmento: "Consultoría de gestión, consultoría tecnológica y agencias B2B",
    descripcion:
      "Empresas de consultoría y agencias con ticket medio alto y baja madurez en automatización comercial.",
    companyIds: companies
      .filter((c) => !c.excluida && SECTORES_CONSULTORIA_AGENCIA.has(c.sector))
      .map((c) => c.id),
    mensajesEnviados: 62,
    respuestasRecibidas: 0,
    reunionesGeneradas: 0,
    fechaInicio: isoDaysAgo(75, 60),
    envioAutomatico: false,
    estado: "activa",
  },
  {
    id: "cam-02",
    nombre: "Software houses en expansión",
    segmento: "Software house",
    descripcion: "Software houses de 5-50 empleados con señales de expansión o nuevo servicio.",
    companyIds: companies.filter((c) => !c.excluida && c.sector === "Software house").map((c) => c.id),
    mensajesEnviados: 34,
    respuestasRecibidas: 0,
    reunionesGeneradas: 0,
    fechaInicio: isoDaysAgo(55, 40),
    envioAutomatico: false,
    estado: "activa",
  },
  {
    id: "cam-03",
    nombre: "Cambio de dirección comercial",
    segmento: "Empresas con incorporación reciente de perfil comercial o dirección comercial",
    descripcion:
      "Empresas donde una nueva dirección comercial o un proceso de contratación sugiere revisión del proceso de ventas.",
    companyIds: [
      ...new Set(
        signals
          .filter((s) => s.tipo === "cambio_direccion_comercial" || s.tipo === "contratacion_comercial")
          .map((s) => s.companyId)
          .filter((id) => !companyById.get(id)?.excluida),
      ),
    ],
    mensajesEnviados: 21,
    respuestasRecibidas: 0,
    reunionesGeneradas: 0,
    fechaInicio: isoDaysAgo(35, 20),
    envioAutomatico: false,
    estado: "pausada",
  },
];

const campaignById = new Map(campaigns.map((c) => [c.id, c]));

function campaignForMessage(m: Message): Campaign {
  if (enviadosSoftware.includes(m)) return campaignById.get("cam-02") as Campaign;
  if (enviadosCambioComercial.includes(m)) return campaignById.get("cam-03") as Campaign;
  return campaignById.get("cam-01") as Campaign;
}

// --- Respuestas (15) ---------------------------------------------------------

const CLASIFICACIONES: ClasificacionRespuesta[] = [
  "interesado",
  "interesado",
  "interesado",
  "interesado",
  "interesado",
  "mas_info",
  "mas_info",
  "mas_info",
  "mas_info",
  "no_interesado",
  "no_interesado",
  "no_interesado",
  "fuera_de_target",
  "fuera_de_target",
  "no_contactar",
];

const RESUMEN_POR_CLASIFICACION: Record<ClasificacionRespuesta, string> = {
  interesado: "Muestra interés explícito y pregunta por disponibilidad para una llamada.",
  mas_info: "Pide más información antes de decidir sobre una reunión.",
  no_interesado: "Indica que no es el momento adecuado para esta iniciativa.",
  fuera_de_target: "Responde que el perfil de la empresa no encaja con lo descrito.",
  no_contactar: "Solicita expresamente no recibir más comunicaciones.",
};

const replies: Reply[] = [];
{
  const pool = enviados.length > 0 ? enviados : messages;
  for (let i = 0; i < 15; i++) {
    const msg = pool[i % pool.length] as Message;
    const clasificacion = CLASIFICACIONES[i] as ClasificacionRespuesta;
    const campaign = campaignForMessage(msg);
    replies.push({
      id: `rep-${pad(i + 1, 3)}`,
      companyId: msg.companyId,
      contactId: msg.contactId,
      campaignId: campaign.id,
      clasificacion,
      fecha: isoDaysAgo(28, 1),
      resumen: RESUMEN_POR_CLASIFICACION[clasificacion],
      textoOriginal:
        clasificacion === "interesado"
          ? "Gracias por el mensaje, sí nos interesa explorarlo. ¿Tenéis hueco esta semana o la siguiente?"
          : clasificacion === "mas_info"
            ? "Antes de nada, ¿nos podéis contar con más detalle cómo funciona el proceso?"
            : clasificacion === "no_interesado"
              ? "Gracias, pero ahora mismo no es una prioridad para nosotros."
              : clasificacion === "fuera_de_target"
                ? "No creo que encajemos con lo que describís, no es nuestro caso."
                : "Por favor, no volváis a escribirnos.",
    });
    if (clasificacion === "no_contactar") {
      const contact = contactById.get(msg.contactId);
      if (contact) contact.noContactar = true;
    }
  }
}

for (const campaign of campaigns) {
  campaign.respuestasRecibidas = replies.filter((r) => r.campaignId === campaign.id).length;
}

// --- Reuniones (5) ------------------------------------------------------------

const ESTADOS_REUNION: EstadoReunion[] = ["realizada", "realizada", "programada", "programada", "cancelada"];

const meetings: Meeting[] = [];
{
  const interesados = replies.filter((r) => r.clasificacion === "interesado");
  for (let i = 0; i < 5; i++) {
    const reply = interesados[i % interesados.length] as Reply;
    meetings.push({
      id: `reu-${pad(i + 1, 3)}`,
      companyId: reply.companyId,
      contactId: reply.contactId,
      campaignId: reply.campaignId,
      fecha: i < 2 ? isoDaysAgo(15, 3) : rng.daysAgo(10, -12).toISOString(),
      estado: ESTADOS_REUNION[i] as EstadoReunion,
      notas:
        ESTADOS_REUNION[i] === "realizada"
          ? "Reunión celebrada. Buen encaje inicial, se envía propuesta."
          : ESTADOS_REUNION[i] === "programada"
            ? "Reunión confirmada, pendiente de celebrarse."
            : "Reunión cancelada por el cliente, pendiente de reprogramar.",
    });
  }
}

for (const campaign of campaigns) {
  campaign.reunionesGeneradas = meetings.filter((r) => r.campaignId === campaign.id).length;
}

// --- Lista global de exclusión -------------------------------------------------

const exclusions: ExclusionEntry[] = [
  {
    id: "exc-01",
    tipo: "empresa",
    valor: "Clínica Dental Vitalia",
    motivo: "Fuera de ICP: ticket medio bajo y perfil B2C.",
    origen: "Revisión manual del equipo comercial",
    fecha: isoDaysAgo(80, 40),
  },
  {
    id: "exc-02",
    tipo: "empresa",
    valor: "Ayuntamiento Digital Servicios",
    motivo: "Administración pública — categoría excluida del ICP.",
    origen: "Regla de exclusión automática por sector",
    fecha: isoDaysAgo(80, 40),
  },
  {
    id: "exc-03",
    tipo: "dominio",
    valor: "competidor-consultoria-demo.es",
    motivo: "Dominio de una empresa competidora de Galt Capital.",
    origen: "Añadido manualmente por dirección",
    fecha: isoDaysAgo(150, 100),
  },
  {
    id: "exc-04",
    tipo: "contacto",
    valor: contacts.find((c) => c.noContactar)?.email ?? "contacto-demo@example.com",
    motivo: "El contacto solicitó expresamente no recibir más comunicaciones.",
    origen: "Respuesta clasificada como 'no contactar'",
    fecha: isoDaysAgo(20, 5),
  },
  {
    id: "exc-05",
    tipo: "dominio",
    valor: "administracion-publica-demo.gob.es",
    motivo: "Dominio institucional — sector excluido.",
    origen: "Regla de exclusión automática por sector",
    fecha: isoDaysAgo(150, 100),
  },
];

// --- Exports ------------------------------------------------------------------

export const MOCK = {
  companies,
  signals,
  contacts,
  dossiers: dossierByCompanyId,
  messages,
  campaigns,
  replies,
  meetings,
  exclusions,
  now: BASE_NOW,
};

export function getCompany(id: string): Company | undefined {
  return companyById.get(id);
}

export function getContact(id: string): Contact | undefined {
  return contactById.get(id);
}

export function getSignal(id: string): Signal | undefined {
  return signalById.get(id);
}

export function getCampaign(id: string): Campaign | undefined {
  return campaignById.get(id);
}

export function getDossier(companyId: string): Dossier | undefined {
  return dossierByCompanyId.get(companyId);
}

export function signalsForCompany(companyId: string): Signal[] {
  const company = companyById.get(companyId);
  if (!company) return [];
  return company.signalIds.map((id) => signalById.get(id)).filter((s): s is Signal => Boolean(s));
}

export function contactsForCompany(companyId: string): Contact[] {
  const company = companyById.get(companyId);
  if (!company) return [];
  return company.contactIds.map((id) => contactById.get(id)).filter((c): c is Contact => Boolean(c));
}

export function messagesForCompany(companyId: string): Message[] {
  return messages.filter((m) => m.companyId === companyId);
}
