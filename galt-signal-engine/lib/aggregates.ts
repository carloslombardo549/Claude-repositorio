import { MOCK } from "./mock/generate";
import { ESTADO_LABEL, TIPO_SENAL_LABEL } from "./scoring";
import type { Estado, TipoSenal } from "./types";

export function estadoDistribution() {
  const counts: Record<Estado, number> = { prioridad_alta: 0, seguimiento: 0, descartado: 0 };
  for (const c of MOCK.companies) {
    if (c.excluida) continue;
    counts[c.estado] += 1;
  }
  const colors: Record<Estado, string> = {
    prioridad_alta: "#1f9d6b",
    seguimiento: "#d9922e",
    descartado: "#8890a3",
  };
  return (Object.keys(counts) as Estado[]).map((estado) => ({
    name: ESTADO_LABEL[estado],
    value: counts[estado],
    color: colors[estado],
  }));
}

export function signalTypeDistribution() {
  const counts = new Map<TipoSenal, number>();
  for (const s of MOCK.signals) {
    counts.set(s.tipo, (counts.get(s.tipo) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tipo, value]) => ({ name: TIPO_SENAL_LABEL[tipo], value }))
    .sort((a, b) => b.value - a.value);
}

export function funnelSteps() {
  const empresasDetectadas = MOCK.companies.filter((c) => !c.excluida).length;
  const conSenal = MOCK.companies.filter((c) => !c.excluida && c.signalIds.length > 0).length;
  const conDecisor = MOCK.companies.filter(
    (c) => !c.excluida && MOCK.contacts.some((ct) => ct.companyId === c.id && ct.esDecisor),
  ).length;
  const conMensaje = new Set(MOCK.messages.map((m) => m.companyId)).size;
  const aprobados = new Set(MOCK.messages.filter((m) => m.estado === "aprobado" || m.estado === "enviado").map((m) => m.companyId)).size;
  const enviados = new Set(MOCK.messages.filter((m) => m.estado === "enviado").map((m) => m.companyId)).size;
  const conRespuesta = new Set(MOCK.replies.map((r) => r.companyId)).size;
  const conReunion = new Set(MOCK.meetings.map((m) => m.companyId)).size;

  return [
    { label: "Empresas detectadas", value: empresasDetectadas },
    { label: "Con señal verificable", value: conSenal },
    { label: "Con decisor identificado", value: conDecisor },
    { label: "Mensaje generado", value: conMensaje },
    { label: "Aprobado", value: aprobados },
    { label: "Enviado", value: enviados },
    { label: "Con respuesta", value: conRespuesta },
    { label: "Reunión conseguida", value: conReunion },
  ];
}

export function topCompanies(n: number) {
  return [...MOCK.companies]
    .filter((c) => !c.excluida)
    .sort((a, b) => b.score.total - a.score.total)
    .slice(0, n);
}

export function weeklyTrend() {
  return [
    { semana: "Sem 1", detectadas: 4, mensajes: 2, respuestas: 0, reuniones: 0 },
    { semana: "Sem 2", detectadas: 6, mensajes: 4, respuestas: 1, reuniones: 0 },
    { semana: "Sem 3", detectadas: 5, mensajes: 5, respuestas: 2, reuniones: 1 },
    { semana: "Sem 4", detectadas: 7, mensajes: 6, respuestas: 3, reuniones: 1 },
    { semana: "Sem 5", detectadas: 4, mensajes: 3, respuestas: 4, reuniones: 1 },
    { semana: "Sem 6", detectadas: 4, mensajes: 5, respuestas: 5, reuniones: 2 },
  ];
}

export function globalStats() {
  const totalEnviados = MOCK.campaigns.reduce((a, c) => a + c.mensajesEnviados, 0);
  const totalRespuestas = MOCK.replies.length;
  const totalReuniones = MOCK.meetings.length;
  const tasaRespuesta = totalEnviados > 0 ? (totalRespuestas / totalEnviados) * 100 : 0;
  const tasaReunion = totalRespuestas > 0 ? (totalReuniones / totalRespuestas) * 100 : 0;
  return {
    totalEnviados,
    totalRespuestas,
    totalReuniones,
    tasaRespuesta,
    tasaReunion,
    mensajesPendientes: MOCK.messages.filter((m) => m.estado === "pendiente_aprobacion").length,
    prioridadAlta: MOCK.companies.filter((c) => !c.excluida && c.estado === "prioridad_alta").length,
    reunionesProgramadas: MOCK.meetings.filter((m) => m.estado === "programada").length,
    reunionesRealizadas: MOCK.meetings.filter((m) => m.estado === "realizada").length,
  };
}

export function segmentPerformance() {
  // Se cuentan empresas distintas por sector (no mensajes/respuestas en
  // bruto): con pocos envíos por sector, contar filas sueltas produce tasas
  // de conversión sin sentido si una misma empresa responde varias veces.
  const bySector = new Map<string, { enviadas: Set<string>; respondidas: Set<string>; interesadas: Set<string> }>();

  function entryFor(sector: string) {
    let entry = bySector.get(sector);
    if (!entry) {
      entry = { enviadas: new Set(), respondidas: new Set(), interesadas: new Set() };
      bySector.set(sector, entry);
    }
    return entry;
  }

  for (const message of MOCK.messages) {
    if (message.estado !== "enviado" && message.estado !== "aprobado") continue;
    const company = MOCK.companies.find((c) => c.id === message.companyId);
    if (!company) continue;
    entryFor(company.sector).enviadas.add(company.id);
  }
  for (const reply of MOCK.replies) {
    const company = MOCK.companies.find((c) => c.id === reply.companyId);
    if (!company) continue;
    const entry = entryFor(company.sector);
    entry.respondidas.add(company.id);
    if (reply.clasificacion === "interesado") entry.interesadas.add(company.id);
  }

  return [...bySector.entries()]
    .map(([sector, v]) => ({
      sector,
      enviados: v.enviadas.size,
      interesados: v.interesadas.size,
      tasaRespuesta: v.enviadas.size > 0 ? (v.respondidas.size / v.enviadas.size) * 100 : 0,
    }))
    .sort((a, b) => b.interesados - a.interesados);
}

export function signalPerformance() {
  const byTipo = new Map<TipoSenal, { mensajes: number; interesados: number }>();
  for (const message of MOCK.messages) {
    const signal = MOCK.signals.find((s) => s.id === message.signalId);
    if (!signal) continue;
    const current = byTipo.get(signal.tipo) ?? { mensajes: 0, interesados: 0 };
    current.mensajes += 1;
    byTipo.set(signal.tipo, current);
  }
  for (const reply of MOCK.replies) {
    if (reply.clasificacion !== "interesado") continue;
    const message = MOCK.messages.find((m) => m.companyId === reply.companyId);
    const signal = message ? MOCK.signals.find((s) => s.id === message.signalId) : undefined;
    if (!signal) continue;
    const current = byTipo.get(signal.tipo) ?? { mensajes: 0, interesados: 0 };
    current.interesados += 1;
    byTipo.set(signal.tipo, current);
  }
  return [...byTipo.entries()]
    .map(([tipo, v]) => ({ tipo, ...v }))
    .filter((r) => r.mensajes > 0)
    .sort((a, b) => b.interesados - a.interesados);
}
