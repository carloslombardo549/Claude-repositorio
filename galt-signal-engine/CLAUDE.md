# CLAUDE.md — Reglas permanentes de Galt Signal Engine

Este archivo define reglas que se aplican a **todo** trabajo futuro dentro de
`galt-signal-engine/`. Léelo antes de modificar código en este proyecto.

## Alcance

- Este proyecto vive exclusivamente dentro de `galt-signal-engine/`. No
  modifiques archivos fuera de esta carpeta salvo petición explícita.
- Es un proyecto Next.js independiente (su propio `package.json`,
  `node_modules`, config). No lo fusiones con nada que exista en la raíz del
  repositorio.

## Idioma y tono

- Toda la interfaz, textos, nombres de campos y mensajes generados están en
  **español de España**.
- Tono profesional, sobrio, sin superlativos vacíos. Nada de emojis en la UI
  de producto salvo que se pida explícitamente.

## Reglas de producto no negociables

1. **Nunca** se automatiza ni se hace scraping de LinkedIn. Cualquier
   referencia a LinkedIn en el código es solo un enlace de consulta manual.
2. **Todo mensaje generado** debe pasar por la Cola de aprobación humana
   antes de considerarse "enviado". No añadir un modo de envío directo.
3. `envioAutomatico` en campañas es `false` por defecto y esta fase no debe
   incluir ningún control de UI que permita activarlo de verdad.
4. El generador de mensajes nunca:
   - promete resultados,
   - ofrece auditorías gratuitas,
   - inventa datos o cifras sin fuente.
   Si no hay evidencia (URL + fecha) suficiente para un dato, no se genera
   personalización para esa empresa/contacto.
5. Cada mensaje personalizado incluye siempre: una señal verificable, la URL
   y fecha de la fuente, una inferencia explícitamente marcada como prudente
   (nunca como hecho), la propuesta de Galt Capital, y el CTA exacto:
   > "¿Estáis buscando una forma más predecible de captar clientes de alto
   > valor este trimestre?"
6. Debe existir una lista global de exclusión y un flag "no contactar" por
   empresa y por contacto, respetado por cualquier flujo de generación/envío.
7. Todo dato (empresa, contacto, señal) simulado debe declarar origen,
   fecha y base del dato — incluso siendo ficticio, el patrón de trazabilidad
   es parte del producto real.
8. ICP objetivo (para scoring y generación de datos): España, B2B, 5-50
   empleados, 1-20M€ de facturación, consultoras/agencias/software
   houses/servicios B2B de ticket alto (>10.000€ por proyecto), founder/CEO/
   socio aún en ventas, baja madurez en automatización/IA. Excluir B2C de
   bajo ticket, restaurantes, clínicas pequeñas, administración pública,
   grandes corporaciones y sectores muy regulados (banca, seguros, sanidad
   regulada, energía regulada).

## Datos simulados

- Todos los datos de esta fase viven en `lib/mock/` y se generan con un PRNG
  determinista (`lib/prng.ts`, semilla fija). **Nunca uses `Math.random()`
  directamente** en datos que se renderizan en servidor: rompe la hidratación
  y la reproducibilidad. Usa siempre el PRNG con semilla.
- No se requiere ninguna clave API en esta fase. Si añades una integración
  real, debe quedar detrás de una variable de entorno documentada en
  `.env.example`, nunca con valores reales hardcodeados.

## Seguridad

- Nunca escribas claves, tokens o secretos reales en el código, commits o
  documentación. Usa `.env.example` con placeholders y confirma que
  `.env.local` está ignorado por Git.
- Cualquier integración futura (Supabase, Inngest, Apollo, Anthropic, email)
  se añade primero como cliente/adaptador con la clave leída de
  `process.env`, con datos simulados como fallback si la clave no está
  presente, para que la demo nunca se rompa por falta de configuración.

## Estilo de código

- TypeScript estricto (`strict: true`). Sin `any` salvo justificación clara.
- Componentes de servidor por defecto; `"use client"` solo donde haya estado,
  efectos o interactividad (animaciones, toggles, formularios, filtros).
- Tailwind CSS v4 (config CSS-first en `app/globals.css`, sin
  `tailwind.config.js`). Paleta y tokens definidos en `@theme`.
- Sin comentarios explicando qué hace el código; solo cuándo el porqué no es
  obvio (p. ej. por qué se usa un PRNG en vez de `Math.random`).

## Comandos

```bash
npm install       # instalar dependencias
npm run dev       # entorno local, http://localhost:3000
npm run lint      # ESLint
npm run typecheck # tsc --noEmit
npm run build     # build de producción
```
