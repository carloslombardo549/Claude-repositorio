import type { TipoSenal } from "../types";
import { tipoSenalFuerzaBase } from "../scoring";

export interface SignalContext {
  nombre: string;
  slug: string;
  ciudad: string;
  sector: string;
  web: string;
}

const OTRAS_CIUDADES = [
  "Lisboa",
  "Barcelona",
  "Madrid",
  "Valencia",
  "Bilbao",
  "Ciudad de México",
  "Bogotá",
];

const NUEVAS_VERTICALES = [
  "clientes del sector salud privado",
  "empresas de logística",
  "clientes del sector industrial",
  "despachos profesionales",
  "clientes del retail especializado",
  "empresas exportadoras",
];

const CLIENTES_SECTOR = [
  "industrial",
  "logístico",
  "financiero",
  "retail",
  "sanitario privado",
  "tecnológico",
];

const SERVICIOS_LANZADOS = [
  "consultoría de eficiencia operativa",
  "acompañamiento en transformación digital",
  "auditoría comercial",
  "servicios gestionados",
  "formación in-company",
  "analítica avanzada de datos",
];

export interface SignalTemplate {
  titulo: string;
  descripcion: string;
  fuenteBase: string;
  fuenteUrl: string;
  fuerza: number;
}

export function buildSignalTemplate(
  tipo: TipoSenal,
  ctx: SignalContext,
  pick: <T>(items: readonly T[]) => T,
): SignalTemplate {
  const fuerza = tipoSenalFuerzaBase(tipo);

  switch (tipo) {
    case "contratacion_comercial":
      return {
        titulo: "Proceso abierto para incorporar perfil comercial",
        descripcion: `${ctx.nombre} tiene abierto un proceso de selección para incorporar un/a nuevo/a perfil comercial en ${ctx.ciudad}.`,
        fuenteBase: "Oferta de empleo publicada (dato simulado)",
        fuenteUrl: `https://portal-empleo-demo.example.com/ofertas/${ctx.slug}-comercial`,
        fuerza,
      };
    case "lanzamiento_servicio":
      return {
        titulo: "Lanzamiento de un nuevo servicio",
        descripcion: `${ctx.nombre} ha anunciado el lanzamiento de un nuevo servicio de ${pick(SERVICIOS_LANZADOS)}.`,
        fuenteBase: "Nota de prensa sectorial (dato simulado)",
        fuenteUrl: `https://prensa-sectorial-demo.example.com/notas/${ctx.slug}-nuevo-servicio`,
        fuerza,
      };
    case "expansion":
      return {
        titulo: "Expansión a una nueva ciudad",
        descripcion: `${ctx.nombre} ha anunciado la apertura de presencia comercial en ${pick(OTRAS_CIUDADES)}.`,
        fuenteBase: "Registro mercantil / nota de prensa (dato simulado)",
        fuenteUrl: `https://registro-mercantil-demo.example.com/anuncios/${ctx.slug}-expansion`,
        fuerza,
      };
    case "nueva_vertical":
      return {
        titulo: "Nueva vertical de negocio",
        descripcion: `${ctx.nombre} ha incorporado una nueva línea de negocio orientada a ${pick(NUEVAS_VERTICALES)}.`,
        fuenteBase: "Web corporativa actualizada (dato simulado)",
        fuenteUrl: `https://${ctx.web}/novedades/nueva-vertical`,
        fuerza,
      };
    case "cambio_direccion_comercial":
      return {
        titulo: "Cambio reciente en la dirección comercial",
        descripcion: `${ctx.nombre} ha incorporado a un/a nuevo/a responsable comercial en los últimos meses.`,
        fuenteBase: "Directorio profesional público (dato simulado, sin scraping de LinkedIn)",
        fuenteUrl: `https://directorio-profesional-demo.example.com/perfiles/${ctx.slug}-direccion-comercial`,
        fuerza,
      };
    case "caso_exito":
      return {
        titulo: "Publicación de un caso de éxito",
        descripcion: `${ctx.nombre} ha publicado un caso de éxito con un cliente del sector ${pick(CLIENTES_SECTOR)}.`,
        fuenteBase: "Blog corporativo (dato simulado)",
        fuenteUrl: `https://${ctx.web}/casos-de-exito/${ctx.slug}`,
        fuerza,
      };
    case "rediseno_web":
      return {
        titulo: "Rediseño de la web corporativa",
        descripcion: `${ctx.nombre} ha renovado recientemente el diseño y el mensaje comercial de su web corporativa.`,
        fuenteBase: "Captura pública de la web corporativa (dato simulado)",
        fuenteUrl: `https://${ctx.web}`,
        fuerza,
      };
    case "necesidad_reuniones":
      return {
        titulo: "Señal agregada de búsqueda de reuniones comerciales",
        descripcion: `${ctx.nombre} muestra un conjunto de señales públicas que sugiere que están buscando generar más reuniones comerciales cualificadas este trimestre.`,
        fuenteBase: "Señal agregada por el radar de Galt Signal Engine (dato simulado)",
        fuenteUrl: `https://radar-galt-demo.example.com/senales/${ctx.slug}`,
        fuerza,
      };
  }
}

export const TODOS_TIPOS_SENAL: TipoSenal[] = [
  "contratacion_comercial",
  "lanzamiento_servicio",
  "expansion",
  "nueva_vertical",
  "cambio_direccion_comercial",
  "caso_exito",
  "rediseno_web",
  "necesidad_reuniones",
];
