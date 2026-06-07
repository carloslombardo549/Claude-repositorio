# Captia — Sistema interno de captación B2B

Plataforma interna para agencias que captan clientes B2B en operaciones de
**ticket alto (> 10.000 €)**. Permite definir el perfil de cliente ideal,
importar empresas y contactos desde Apollo (CSV), clasificar cuentas A/B/C,
generar borradores de email con **aprobación humana obligatoria**, registrar
respuestas y reuniones, y visualizar el pipeline comercial.

> **Estado:** MVP funcional. El **envío real de emails está deshabilitado** a
> propósito en esta fase: los borradores llegan hasta el estado *aprobado*.

---

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (diseño premium tipo SaaS, tema oscuro)
- **Supabase** (Postgres + Auth + Row Level Security)
- **Zod** para validación (formularios, acciones y cada fila del CSV)
- **PapaParse** para importación CSV de Apollo
- **Recharts** para gráficos
- Desplegable en **Vercel**

---

## Arquitectura

- **Multi-tenant**: la agencia gestiona varias *organizaciones cliente*. Todos
  los datos cuelgan de `organization_id`.
- **Roles**: `agency_admin` (acceso global) y `client_user` (solo su
  organización), aplicados mediante **RLS** en Supabase.
- **Capa de datos con degradación elegante** (`lib/data`): si Supabase está
  configurado lee de la base de datos; si no, usa **datos semilla locales**
  (`lib/seed-data.ts`) para funcionar en modo demo sin backend.
- **Clasificación A/B/C** (`lib/scoring.ts`): cada empresa se puntúa 0-100
  contra el ICP (sector, tamaño, geografía, decisor, calidad de datos) →
  A (≥75), B (50-74), C (<50).

### Estructura del proyecto

```
app/
  login/            Login (Supabase Auth o modo demo)
  page.tsx          Dashboard
  empresas/         Empresas objetivo (clasificación A/B/C + importación CSV)
  contactos/        Contactos (con decisores)
  campanas/         Campañas
  generador/        Generador de mensajes + cola de aprobación
  respuestas/       Bandeja de respuestas (con sentimiento)
  pipeline/         Pipeline comercial (kanban)
  reuniones/        Reuniones
  informes/         Informes semanales
  configuracion/    ICP + lista de exclusión + roles
components/         UI (Sidebar, badges, gráficos, modales, formularios)
lib/
  data/             Capa de acceso a datos (Supabase | semilla)
  supabase/         Clientes browser/server/middleware + config
  validation/       Esquemas Zod (incluye mapeo CSV de Apollo)
  scoring.ts        Clasificación A/B/C
  seed-data.ts      Datos ficticios para modo demo
  csv.ts            Normalización y exclusión de filas
supabase/
  migrations/0001_init.sql   Esquema + RLS + triggers
  seed.sql                   Datos ficticios para la base de datos
```

---

## Instalación

### 1. Requisitos
- Node.js 18+ (probado con Node 22)
- npm

### 2. Clonar e instalar
```bash
git clone <repo>
cd Claude-repositorio
npm install
```

### 3. Arrancar en modo demo (sin Supabase)
```bash
npm run dev
```
Abre http://localhost:3000, pulsa **Entrar** en el login y explora la
plataforma con datos ficticios.

### 4. Conectar Supabase (opcional)
1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En el **SQL Editor**, ejecuta en orden:
   - `supabase/migrations/0001_init.sql` (esquema, RLS, triggers)
   - `supabase/seed.sql` (datos ficticios)
3. Copia las claves de la API:
   ```bash
   cp .env.example .env.local
   ```
   Rellena `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Crea un usuario en **Authentication → Users**. Se generará su `profile`
   automáticamente; asígnale una organización y rol desde la tabla `profiles`:
   ```sql
   update profiles
   set organization_id = '00000000-0000-0000-0000-000000000001',
       role = 'agency_admin'
   where email = 'tu@email.com';
   ```
5. Reinicia `npm run dev`. Ahora la app lee de Supabase con RLS activo.

### 5. Despliegue en Vercel
1. Importa el repositorio en Vercel.
2. Añade las variables `NEXT_PUBLIC_SUPABASE_URL` y
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` en *Project Settings → Environment Variables*.
3. Deploy. Build command y output son los estándar de Next.js.

---

## Scripts

| Comando         | Descripción                          |
|-----------------|--------------------------------------|
| `npm run dev`   | Servidor de desarrollo               |
| `npm run build` | Build de producción (type-check)     |
| `npm run start` | Servir el build                      |
| `npm run lint`  | Linter de Next.js                    |

---

## Importación CSV de Apollo

En **Empresas objetivo → Importar CSV** se sube el export de Apollo. El sistema:
1. Mapea las cabeceras de Apollo (`First Name`, `Title`, `Company`, `Email`…).
2. Valida cada fila con Zod.
3. Calcula el encaje A/B/C contra el ICP.
4. Filtra contactos de la **lista de exclusión / no contactar**.
5. Muestra una previsualización antes de confirmar.

---

## Próximas fases (fuera del MVP)

- Activar el **envío real de emails** (integración con proveedor de envío).
- Server actions de escritura conectadas a Supabase (importación persistente,
  creación de campañas, generación de informes guardados).
- Generación de borradores asistida por IA (actualmente por plantillas).
- Detección automática de sentimiento en respuestas.

> En esta fase **no** hay envío real de emails ni integraciones externas, y
> **no** se usan datos reales de clientes (todo es ficticio).
