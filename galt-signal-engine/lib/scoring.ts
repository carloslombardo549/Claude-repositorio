import type { Estado, Madurez, ScoreBreakdown, Signal, TipoSenal } from "./types";

// Pesos del sistema de puntuación (0-100), fijados por producto:
// ICP 35 · Señal de necesidad 30 · Problema comercial 20 · Accesibilidad 15
const PESO_ICP = 35;
const PESO_SENAL = 30;
const PESO_PROBLEMA = 20;
const PESO_ACCESIBILIDAD = 15;

export interface IcpInput {
  sector: string;
  empleados: number;
  facturacionEurM: number;
  ticketMedioEur: number;
  decisorInvolucrado: boolean;
  madurezAutomatizacion: Madurez;
}

const SECTORES_ICP = new Set([
  "Consultoría de gestión",
  "Consultoría tecnológica",
  "Agencia de marketing",
  "Agencia de comunicación",
  "Software house",
  "Servicios legales B2B",
  "Servicios de RRHH",
  "Ingeniería y proyectos",
  "Formación corporativa",
  "Ciberseguridad",
]);

// Fuerza relativa de cada tipo de señal como indicador de intención de compra.
const FUERZA_BASE_POR_TIPO: Record<TipoSenal, number> = {
  contratacion_comercial: 0.85,
  cambio_direccion_comercial: 0.8,
  lanzamiento_servicio: 0.7,
  nueva_vertical: 0.65,
  expansion: 0.6,
  necesidad_reuniones: 0.55,
  caso_exito: 0.45,
  rediseno_web: 0.35,
};

export function tipoSenalFuerzaBase(tipo: TipoSenal): number {
  return FUERZA_BASE_POR_TIPO[tipo];
}

export function calcularIcpFit(input: IcpInput): number {
  let puntos = 0;

  // Sector (hasta 12)
  puntos += SECTORES_ICP.has(input.sector) ? 12 : 3;

  // Tamaño de plantilla, 5-50 empleados es el objetivo (hasta 8)
  if (input.empleados >= 5 && input.empleados <= 50) {
    const centro = 20;
    const distancia = Math.abs(input.empleados - centro) / centro;
    puntos += Math.max(4, 8 - distancia * 4);
  } else {
    puntos += 1;
  }

  // Facturación 1-20M€ (hasta 8)
  if (input.facturacionEurM >= 1 && input.facturacionEurM <= 20) {
    puntos += 8;
  } else if (input.facturacionEurM < 1) {
    puntos += 2;
  } else {
    puntos += 3;
  }

  // Ticket medio > 10.000€ (hasta 4)
  puntos += input.ticketMedioEur >= 10000 ? 4 : 1;

  // Decisor todavía en ventas (hasta 3)
  puntos += input.decisorInvolucrado ? 3 : 0;

  return Math.min(PESO_ICP, Math.round(puntos));
}

export function calcularSenalNecesidad(signals: Signal[]): number {
  if (signals.length === 0) return 0;
  const mejor = Math.max(...signals.map((s) => s.fuerza));
  const bonusVolumen = Math.min(signals.length - 1, 3) * 0.03;
  const puntos = (mejor + bonusVolumen) * PESO_SENAL;
  return Math.min(PESO_SENAL, Math.round(puntos));
}

export function calcularProblemaComercial(
  madurez: Madurez,
  signals: Signal[],
): number {
  const baseMadurez: Record<Madurez, number> = { baja: 14, media: 8, alta: 3 };
  const señalesRelevantes = signals.filter((s) =>
    ["contratacion_comercial", "cambio_direccion_comercial", "necesidad_reuniones"].includes(s.tipo),
  ).length;
  const puntos = baseMadurez[madurez] + Math.min(señalesRelevantes * 2, 6);
  return Math.min(PESO_PROBLEMA, Math.round(puntos));
}

export function calcularAccesibilidadDecisor(
  decisorInvolucrado: boolean,
  hayContactoDirecto: boolean,
): number {
  let puntos = 0;
  if (decisorInvolucrado) puntos += 8;
  if (hayContactoDirecto) puntos += 7;
  return Math.min(PESO_ACCESIBILIDAD, puntos);
}

export function calcularScore(
  icp: IcpInput,
  signals: Signal[],
  hayContactoDirecto: boolean,
): ScoreBreakdown {
  const icpFit = calcularIcpFit(icp);
  const senalNecesidad = calcularSenalNecesidad(signals);
  const problemaComercial = calcularProblemaComercial(icp.madurezAutomatizacion, signals);
  const accesibilidadDecisor = calcularAccesibilidadDecisor(icp.decisorInvolucrado, hayContactoDirecto);
  const total = icpFit + senalNecesidad + problemaComercial + accesibilidadDecisor;
  return { icpFit, senalNecesidad, problemaComercial, accesibilidadDecisor, total };
}

export function estadoFromScore(total: number): Estado {
  if (total >= 75) return "prioridad_alta";
  if (total >= 60) return "seguimiento";
  return "descartado";
}

export const ESTADO_LABEL: Record<Estado, string> = {
  prioridad_alta: "Prioridad alta",
  seguimiento: "Seguimiento",
  descartado: "Descartado temporalmente",
};

export const TIPO_SENAL_LABEL: Record<TipoSenal, string> = {
  contratacion_comercial: "Contratación de comerciales",
  lanzamiento_servicio: "Lanzamiento de un servicio",
  expansion: "Expansión a otra ciudad o país",
  nueva_vertical: "Nueva vertical de negocio",
  cambio_direccion_comercial: "Cambio de dirección comercial",
  caso_exito: "Publicación de caso de éxito",
  rediseno_web: "Rediseño de la web",
  necesidad_reuniones: "Necesidad de reuniones con decisores",
};
