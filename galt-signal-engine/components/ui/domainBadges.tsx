import { Badge, type BadgeTone } from "./Badge";
import { ESTADO_LABEL, TIPO_SENAL_LABEL } from "@/lib/scoring";
import type { ClasificacionRespuesta, Estado, EstadoMensaje, EstadoReunion, TipoSenal } from "@/lib/types";

const ESTADO_TONE: Record<Estado, BadgeTone> = {
  prioridad_alta: "success",
  seguimiento: "warning",
  descartado: "neutral",
};

export function EstadoBadge({ estado }: { estado: Estado }) {
  return <Badge tone={ESTADO_TONE[estado]}>{ESTADO_LABEL[estado]}</Badge>;
}

export function ScoreBadge({ score }: { score: number }) {
  const tone: BadgeTone = score >= 75 ? "success" : score >= 60 ? "warning" : "neutral";
  return (
    <Badge tone={tone} className="font-semibold">
      {score}/100
    </Badge>
  );
}

export function TipoSenalBadge({ tipo }: { tipo: TipoSenal }) {
  return <Badge tone="info">{TIPO_SENAL_LABEL[tipo]}</Badge>;
}

const MENSAJE_LABEL: Record<EstadoMensaje, string> = {
  borrador: "Borrador",
  pendiente_aprobacion: "Pendiente de aprobación",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  enviado: "Enviado",
};

const MENSAJE_TONE: Record<EstadoMensaje, BadgeTone> = {
  borrador: "neutral",
  pendiente_aprobacion: "warning",
  aprobado: "info",
  rechazado: "danger",
  enviado: "success",
};

export function MensajeEstadoBadge({ estado }: { estado: EstadoMensaje }) {
  return <Badge tone={MENSAJE_TONE[estado]}>{MENSAJE_LABEL[estado]}</Badge>;
}

const CLASIFICACION_LABEL: Record<ClasificacionRespuesta, string> = {
  interesado: "Interesado",
  mas_info: "Pide más información",
  no_interesado: "No interesado",
  fuera_de_target: "Fuera de target",
  no_contactar: "No contactar",
};

const CLASIFICACION_TONE: Record<ClasificacionRespuesta, BadgeTone> = {
  interesado: "success",
  mas_info: "info",
  no_interesado: "neutral",
  fuera_de_target: "neutral",
  no_contactar: "danger",
};

export function ClasificacionBadge({ clasificacion }: { clasificacion: ClasificacionRespuesta }) {
  return <Badge tone={CLASIFICACION_TONE[clasificacion]}>{CLASIFICACION_LABEL[clasificacion]}</Badge>;
}

const REUNION_LABEL: Record<EstadoReunion, string> = {
  programada: "Programada",
  realizada: "Realizada",
  cancelada: "Cancelada",
};

const REUNION_TONE: Record<EstadoReunion, BadgeTone> = {
  programada: "info",
  realizada: "success",
  cancelada: "danger",
};

export function ReunionEstadoBadge({ estado }: { estado: EstadoReunion }) {
  return <Badge tone={REUNION_TONE[estado]}>{REUNION_LABEL[estado]}</Badge>;
}
