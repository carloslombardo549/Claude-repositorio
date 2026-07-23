import type { TipoSenal } from "../types";

export const CTA_FIJO =
  "¿Estáis buscando una forma más predecible de captar clientes de alto valor este trimestre?";

export const PROPUESTA_GALT =
  "En Galt Capital instalamos y operamos en 14 días un sistema de captación B2B que identifica empresas objetivo, encuentra decisores, genera mensajes personalizados y convierte señales comerciales en conversaciones cualificadas.";

// Inferencias deliberadamente formuladas en condicional / con matización
// ("podría", "es posible que"): nunca se presentan como hechos.
const INFERENCIA_POR_TIPO: Record<TipoSenal, string> = {
  contratacion_comercial:
    "podría indicar que estáis reforzando la capacidad comercial para sostener el crecimiento previsto",
  lanzamiento_servicio:
    "podría suponer la necesidad de generar demanda cualificada para el nuevo servicio en los próximos meses",
  expansion:
    "podría implicar la necesidad de abrir conversaciones con nuevas cuentas en el mercado de destino",
  nueva_vertical:
    "podría requerir validar el encaje comercial de la nueva línea de negocio con clientes potenciales",
  cambio_direccion_comercial:
    "es posible que estéis revisando el proceso comercial junto con la nueva dirección",
  caso_exito:
    "podría ser un buen momento para replicar ese resultado con cuentas similares",
  rediseno_web:
    "podría acompañarse de una revisión más amplia del posicionamiento comercial",
  necesidad_reuniones:
    "podría estar relacionado con la dificultad de generar suficientes reuniones cualificadas de forma predecible",
};

export function inferenciaPrudente(tipo: TipoSenal): string {
  return INFERENCIA_POR_TIPO[tipo];
}

export function buildMessageBody(params: {
  contactoNombre: string;
  empresaNombre: string;
  señalDescripcion: string;
  fuenteUrl: string;
  fuenteFechaFormateada: string;
  tipo: TipoSenal;
}): string {
  const { contactoNombre, empresaNombre, señalDescripcion, fuenteUrl, fuenteFechaFormateada, tipo } = params;
  const primerNombre = contactoNombre.split(" ")[0];

  return [
    `Hola ${primerNombre},`,
    "",
    `He visto que ${señalDescripcion} (fuente: ${fuenteUrl}, ${fuenteFechaFormateada}). Sin conocer el detalle interno, ${inferenciaPrudente(tipo)}.`,
    "",
    `Por eso os escribo desde Galt Capital: trabajamos con empresas como ${empresaNombre} en esta misma situación. ${PROPUESTA_GALT}`,
    "",
    CTA_FIJO,
    "",
    "Un saludo,",
    "Equipo Galt Capital",
  ].join("\n");
}
