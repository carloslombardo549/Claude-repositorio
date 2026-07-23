# PLAN.md — Galt Signal Engine

## 1. Qué es

Galt Signal Engine es el SaaS interno de Galt Capital para detectar empresas
B2B españolas con señales de necesidad comercial, puntuarlas, encontrar al
decisor, investigar la empresa, generar un mensaje personalizado y
gestionar respuestas y reuniones.

Fase actual: **demo local navegable con datos simulados**, sin claves API
reales, preparada arquitectónicamente para conectar Supabase, Inngest,
Apollo, Anthropic y una plataforma de email en una fase posterior.

## 2. Stack técnico

| Capa | Elección | Motivo |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) + TypeScript | SSR/SSG, rutas de archivo, estándar de facto |
| Estilos | Tailwind CSS v4 (CSS-first, `@theme`) | Velocidad de iteración, diseño consistente |
| Datos (fase 1) | Módulos TS generados con PRNG determinista (`lib/mock/*`) | Cero backend, datos coherentes y reproducibles |
| Datos (fase 2) | Supabase / PostgreSQL | Persistencia real, auth, RLS |
| Jobs programados (fase 2) | Inngest | Radar recurrente, reintentos, observabilidad |
| Enriquecimiento (fase 2) | Apollo.io | Encontrar decisor + datos de empresa |
| Redacción (fase 2) | Anthropic API | Generación de mensajes personalizados |
| Envío (fase 2) | Proveedor de email (p.ej. Resend/Instantly) | Entrega y tracking de secuencias |
| Iconos / gráficas | lucide-react, recharts | Ligero, buen soporte TS |
| Tema | next-themes | Claro/oscuro con persistencia |

Todas las dependencias se fijan a la última versión estable disponible en el
momento de creación del proyecto (ver `package.json`).

## 3. Arquitectura de carpetas

```
galt-signal-engine/
  app/                     rutas (App Router), una carpeta por página
  components/
    layout/                Sidebar, Topbar, ThemeToggle, shell de la app
    ui/                    primitivas de diseño (Card, Badge, Button, Stat...)
    dashboard/, empresas/, radar/, contactos/, aprobacion/,
    campanas/, respuestas/, reuniones/, informes/, configuracion/
                           componentes específicos de cada página
  lib/
    types.ts               tipos de dominio compartidos
    scoring.ts              motor de puntuación ICP (0-100)
    prng.ts                 PRNG determinista (mulberry32) para datos estables
    mock/                   generadores de datos simulados (empresas, contactos,
                            señales, campañas, respuestas, reuniones, exclusiones)
    format.ts               formateo de fechas/moneda en es-ES
  PLAN.md
  CLAUDE.md
  .env.example
```

## 4. Modelo de datos (dominio)

### Company (Empresa objetivo)
- id, nombre, cif (ficticio), sector, ciudad, provincia
- empleados (5-50), facturacionEurM (1-20)
- web, descripcion
- decisorInvolucrado: boolean ("founder/CEO/socio sigue en ventas")
- madurezAutomatizacion: 'baja' | 'media' | 'alta'
- fechaDeteccion
- icpFit, señalNecesidad, problemaComercial, accesibilidadDecisor (subpuntuaciones)
- scoreTotal (0-100), estado: 'prioridad_alta' | 'seguimiento' | 'descartado'
- excluida: boolean, motivoExclusion?
- noContactar: boolean
- señales: Signal[] (referenciadas por companyId)
- contactos: Contact[] (referenciados por companyId)

### Signal (Señal)
- id, companyId, tipo (contratación comercial, lanzamiento de servicio,
  expansión, nueva vertical, cambio de dirección comercial, caso de éxito,
  rediseño web, necesidad de reuniones con decisores)
- descripcion, fuenteUrl, fuenteFecha, fuenteBase ("origen del dato")
- fuerza (impacto en puntuación)

### Contact (Contacto / decisor)
- id, companyId, nombre, cargo, esDecisor: boolean
- email (simulado), telefono (simulado), linkedinUrl (solo referencia, sin scraping)
- fuenteDato, noContactar

### Dossier (Investigación)
- companyId, resumen, señalesClave: Signal[], inferencias: string[] (marcadas
  explícitamente como prudentes, no hechos), fuentes: {url, fecha}[]

### Message (Mensaje personalizado)
- id, companyId, contactId, señalUsada (Signal), textoGenerado
- estado: 'borrador' | 'pendiente_aprobacion' | 'aprobado' | 'rechazado' | 'enviado'
- editadoPor, fechaAprobacion
- cta fijo obligatorio

### Campaign (Campaña)
- id, nombre, segmento, mensajesEnviados, tasaRespuesta, reunionesGeneradas
- envioAutomatico: boolean (**false por defecto, no editable en fase 1**)

### Reply (Respuesta)
- id, companyId, campaignId, clasificacion: 'interesado' | 'no_interesado' |
  'mas_info' | 'fuera_de_target' | 'no_contactar'
- fecha, resumen

### Meeting (Reunión)
- id, companyId, contactId, fecha, estado: 'programada' | 'realizada' | 'cancelada'
- notas

### ExclusionEntry (Lista global de exclusión)
- id, tipo: 'empresa' | 'contacto' | 'dominio'
- valor, motivo, origen, fecha

## 5. Motor de puntuación (0-100)

- Encaje ICP: 35 pts (sector, tamaño, facturación, ticket, decisor en ventas)
- Señal de necesidad/intención: 30 pts (según tipo y fuerza de señal)
- Problema comercial probable: 20 pts (inferido de señales + madurez baja)
- Accesibilidad del decisor: 15 pts (contacto directo identificado)

Estados: ≥75 prioridad alta · 60-74 seguimiento · <60 descartado temporalmente.

Implementado en `lib/scoring.ts`, puro y testeable, usado tanto por el
generador de datos simulados como (en el futuro) por el radar real.

## 6. Flujo principal (mapeado a UI)

1. Descubrir empresas → **Radar de señales** (botón "Ejecutar radar", animación)
2. Detectar señales verificables → **Radar de señales**
3. Calcular puntuación → **Empresas objetivo** (badge de score/estado)
4. Encontrar decisor → **Contactos y decisores**
5. Dossier de investigación → ficha de empresa (`/empresas/[id]`)
6. Generar mensaje personalizado → dentro de la ficha de empresa
7. Cola de aprobación humana → **Cola de aprobación**
8. Registrar envío/respuesta/reunión → **Campañas**, **Bandeja de respuestas**, **Reuniones**
9. Aprender qué funciona → **Informes**

## 7. Seguridad y cumplimiento (invariantes de producto)

- Sin automatización ni scraping de LinkedIn en ningún flujo.
- Lista global de exclusión + flag "no contactar" por empresa/contacto.
- Todo dato simulado declara origen, fecha y base ("dato simulado con fines de demo").
- `envioAutomatico` de campañas es `false` por defecto y no se ofrece un
  control para activarlo en esta fase (deshabilitado explícitamente en UI).
- Todos los mensajes pasan por **Cola de aprobación** antes de "enviarse".
- El generador de mensajes nunca promete resultados ni ofrece auditorías
  gratuitas; si no hay evidencia (fuente) suficiente, no genera personalización.

## 8. Fases

**Fase 1 (esta entrega):** demo local 100% navegable, datos simulados,
sin claves API, diseño premium claro/oscuro, responsive.

**Fase 2:** Supabase (auth + persistencia + RLS), Inngest (radar programado,
reintentos), integraciones reales (Apollo, Anthropic, proveedor de email),
sustitución progresiva de `lib/mock/*` por llamadas a base de datos/API
manteniendo los mismos tipos de dominio.

**Fase 3:** aprendizaje de segmentos/mensajes ganadores, envío semi-automático
con aprobación por lotes, alertas de reuniones en riesgo.

## 9. Cómo correr

```bash
cd galt-signal-engine
npm install
npm run dev
```

Ver `README` implícito en este PLAN: la app arranca en `http://localhost:3000`.
