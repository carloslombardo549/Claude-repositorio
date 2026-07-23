export type Estado = "prioridad_alta" | "seguimiento" | "descartado";

export type Madurez = "baja" | "media" | "alta";

export type TipoSenal =
  | "contratacion_comercial"
  | "lanzamiento_servicio"
  | "expansion"
  | "nueva_vertical"
  | "cambio_direccion_comercial"
  | "caso_exito"
  | "rediseno_web"
  | "necesidad_reuniones";

export interface Signal {
  id: string;
  companyId: string;
  tipo: TipoSenal;
  titulo: string;
  descripcion: string;
  fuenteUrl: string;
  fuenteFecha: string; // ISO date
  fuenteBase: string; // origen del dato, p.ej. "Nota de prensa simulada"
  fuerza: number; // 0-1, impacto relativo en el scoring
  fechaDeteccion: string; // ISO date
}

export interface ScoreBreakdown {
  icpFit: number; // 0-35
  senalNecesidad: number; // 0-30
  problemaComercial: number; // 0-20
  accesibilidadDecisor: number; // 0-15
  total: number; // 0-100
}

export interface Company {
  id: string;
  nombre: string;
  cif: string;
  sector: string;
  ciudad: string;
  provincia: string;
  empleados: number;
  facturacionEurM: number;
  web: string;
  descripcion: string;
  fundada: number;
  decisorInvolucrado: boolean;
  madurezAutomatizacion: Madurez;
  ticketMedioEur: number;
  fechaDeteccion: string; // ISO date
  origenDato: string;
  score: ScoreBreakdown;
  estado: Estado;
  excluida: boolean;
  motivoExclusion?: string;
  noContactar: boolean;
  signalIds: string[];
  contactIds: string[];
}

export interface Contact {
  id: string;
  companyId: string;
  nombre: string;
  cargo: string;
  esDecisor: boolean;
  email: string;
  telefono: string;
  linkedinUrl: string;
  fuenteDato: string;
  fechaDeteccion: string;
  noContactar: boolean;
}

export type EstadoMensaje =
  | "borrador"
  | "pendiente_aprobacion"
  | "aprobado"
  | "rechazado"
  | "enviado";

export interface DossierInferencia {
  texto: string;
  prudente: true;
}

export interface Dossier {
  companyId: string;
  resumen: string;
  senalesClaveIds: string[];
  inferencias: DossierInferencia[];
  fuentes: { url: string; fecha: string; base: string }[];
}

export interface Message {
  id: string;
  companyId: string;
  contactId: string;
  signalId: string;
  cuerpo: string;
  cta: string;
  estado: EstadoMensaje;
  creadoEn: string;
  editadoPor?: string;
  fechaAprobacion?: string;
  fechaRechazo?: string;
  motivoRechazo?: string;
}

export interface Campaign {
  id: string;
  nombre: string;
  segmento: string;
  descripcion: string;
  companyIds: string[];
  mensajesEnviados: number;
  respuestasRecibidas: number;
  reunionesGeneradas: number;
  fechaInicio: string;
  envioAutomatico: false;
  estado: "activa" | "pausada" | "finalizada";
}

export type ClasificacionRespuesta =
  | "interesado"
  | "mas_info"
  | "no_interesado"
  | "fuera_de_target"
  | "no_contactar";

export interface Reply {
  id: string;
  companyId: string;
  contactId: string;
  campaignId: string;
  clasificacion: ClasificacionRespuesta;
  fecha: string;
  resumen: string;
  textoOriginal: string;
}

export type EstadoReunion = "programada" | "realizada" | "cancelada";

export interface Meeting {
  id: string;
  companyId: string;
  contactId: string;
  campaignId: string;
  fecha: string;
  estado: EstadoReunion;
  notas: string;
}

export interface ExclusionEntry {
  id: string;
  tipo: "empresa" | "contacto" | "dominio";
  valor: string;
  motivo: string;
  origen: string;
  fecha: string;
}
