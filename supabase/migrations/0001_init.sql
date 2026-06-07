-- ============================================================================
-- Sistema interno de captación B2B — Esquema inicial
-- Plataforma multi-tenant: una agencia gestiona varias organizaciones cliente.
-- Roles: agency_admin (acceso global) y client_user (acceso a su organización).
-- ============================================================================

-- Extensiones -----------------------------------------------------------------
create extension if not exists "pgcrypto";

-- Tipos enumerados ------------------------------------------------------------
do $$ begin
  create type user_role        as enum ('agency_admin', 'client_user');
exception when duplicate_object then null; end $$;

do $$ begin
  create type account_grade    as enum ('A', 'B', 'C', 'unrated');
exception when duplicate_object then null; end $$;

do $$ begin
  create type company_status   as enum ('new', 'researching', 'ready', 'contacted', 'replied', 'won', 'lost', 'excluded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type contact_status   as enum ('new', 'queued', 'contacted', 'replied', 'meeting', 'unsubscribed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type campaign_status  as enum ('draft', 'active', 'paused', 'finished');
exception when duplicate_object then null; end $$;

do $$ begin
  create type draft_status     as enum ('draft', 'pending_approval', 'approved', 'rejected', 'sent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type message_kind     as enum ('outbound', 'reply');
exception when duplicate_object then null; end $$;

do $$ begin
  create type message_sentiment as enum ('positive', 'neutral', 'negative', 'ooo', 'unknown');
exception when duplicate_object then null; end $$;

do $$ begin
  create type meeting_status   as enum ('scheduled', 'completed', 'no_show', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type deal_stage       as enum ('lead', 'qualified', 'meeting', 'proposal', 'won', 'lost');
exception when duplicate_object then null; end $$;

do $$ begin
  create type exclusion_type   as enum ('email', 'domain', 'company');
exception when duplicate_object then null; end $$;

-- ============================================================================
-- Organizaciones (tenants = empresas cliente de la agencia)
-- ============================================================================
create table if not exists organizations (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  website      text,
  created_at   timestamptz not null default now()
);

-- ============================================================================
-- Perfiles de usuario (1-1 con auth.users de Supabase)
-- ============================================================================
create table if not exists profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references organizations(id) on delete set null,
  full_name       text,
  email           text,
  role            user_role not null default 'client_user',
  created_at      timestamptz not null default now()
);

-- ============================================================================
-- Perfil de Cliente Ideal (ICP) — uno por organización
-- ============================================================================
create table if not exists icp_profiles (
  id                 uuid primary key default gen_random_uuid(),
  organization_id    uuid not null references organizations(id) on delete cascade,
  name               text not null default 'ICP principal',
  sectors            text[] not null default '{}',          -- sectores objetivo
  employee_min       int,
  employee_max       int,
  deal_value_min     numeric not null default 10000,        -- ticket mínimo (€)
  geographies        text[] not null default '{}',          -- países/regiones
  decision_titles    text[] not null default '{}',          -- cargos de decisor
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists idx_icp_org on icp_profiles(organization_id);

-- ============================================================================
-- Empresas objetivo
-- ============================================================================
create table if not exists companies (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name            text not null,
  domain          text,
  sector          text,
  employees       int,
  size_label      text,                                     -- p.ej. "200-500"
  revenue         text,                                     -- texto libre del CSV
  country         text,
  city            text,
  grade           account_grade not null default 'unrated', -- A / B / C
  fit_score       int not null default 0,                   -- 0-100
  status          company_status not null default 'new',
  description     text,
  source          text default 'manual',                    -- apollo | manual | csv
  created_at      timestamptz not null default now()
);
create index if not exists idx_companies_org on companies(organization_id);
create index if not exists idx_companies_grade on companies(organization_id, grade);

-- ============================================================================
-- Contactos
-- ============================================================================
create table if not exists contacts (
  id                 uuid primary key default gen_random_uuid(),
  organization_id    uuid not null references organizations(id) on delete cascade,
  company_id         uuid references companies(id) on delete set null,
  full_name          text not null,
  title              text,
  email              text,
  linkedin_url       text,
  phone              text,
  seniority          text,                                  -- p.ej. C-Level, VP
  is_decision_maker  boolean not null default false,
  status             contact_status not null default 'new',
  source             text default 'manual',
  created_at         timestamptz not null default now()
);
create index if not exists idx_contacts_org on contacts(organization_id);
create index if not exists idx_contacts_company on contacts(company_id);
create unique index if not exists uq_contacts_org_email on contacts(organization_id, lower(email)) where email is not null;

-- ============================================================================
-- Campañas
-- ============================================================================
create table if not exists campaigns (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name            text not null,
  description     text,
  channel         text default 'email',
  status          campaign_status not null default 'draft',
  start_date      date,
  end_date        date,
  created_at      timestamptz not null default now()
);
create index if not exists idx_campaigns_org on campaigns(organization_id);

-- Contactos incluidos en una campaña
create table if not exists campaign_targets (
  id          uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  contact_id  uuid not null references contacts(id) on delete cascade,
  added_at    timestamptz not null default now(),
  unique (campaign_id, contact_id)
);

-- ============================================================================
-- Borradores de email (flujo de aprobación humana)
-- ============================================================================
create table if not exists email_drafts (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  contact_id      uuid not null references contacts(id) on delete cascade,
  campaign_id     uuid references campaigns(id) on delete set null,
  subject         text not null,
  body            text not null,
  status          draft_status not null default 'draft',
  approved_by     uuid references profiles(id) on delete set null,
  approved_at     timestamptz,
  created_at      timestamptz not null default now()
);
create index if not exists idx_drafts_org on email_drafts(organization_id);
create index if not exists idx_drafts_status on email_drafts(organization_id, status);

-- ============================================================================
-- Mensajes (registro de enviados y respuestas)
-- ============================================================================
create table if not exists messages (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  contact_id      uuid not null references contacts(id) on delete cascade,
  campaign_id     uuid references campaigns(id) on delete set null,
  draft_id        uuid references email_drafts(id) on delete set null,
  kind            message_kind not null,
  subject         text,
  body            text,
  sentiment       message_sentiment not null default 'unknown',
  occurred_at     timestamptz not null default now()
);
create index if not exists idx_messages_org on messages(organization_id);
create index if not exists idx_messages_kind on messages(organization_id, kind);

-- ============================================================================
-- Reuniones
-- ============================================================================
create table if not exists meetings (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  contact_id      uuid not null references contacts(id) on delete cascade,
  company_id      uuid references companies(id) on delete set null,
  scheduled_at    timestamptz not null,
  status          meeting_status not null default 'scheduled',
  notes           text,
  created_at      timestamptz not null default now()
);
create index if not exists idx_meetings_org on meetings(organization_id);

-- ============================================================================
-- Pipeline comercial (oportunidades)
-- ============================================================================
create table if not exists deals (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  company_id      uuid references companies(id) on delete set null,
  contact_id      uuid references contacts(id) on delete set null,
  title           text not null,
  stage           deal_stage not null default 'lead',
  value           numeric not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_deals_org on deals(organization_id);
create index if not exists idx_deals_stage on deals(organization_id, stage);

-- ============================================================================
-- Lista de exclusión / no contactar
-- ============================================================================
create table if not exists exclusion_list (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  type            exclusion_type not null,
  value           text not null,            -- email, dominio o nombre de empresa
  reason          text,
  created_at      timestamptz not null default now(),
  unique (organization_id, type, value)
);
create index if not exists idx_exclusion_org on exclusion_list(organization_id);

-- ============================================================================
-- Informes semanales (snapshot de métricas)
-- ============================================================================
create table if not exists weekly_reports (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  week_start      date not null,
  metrics         jsonb not null default '{}',
  summary         text,
  created_at      timestamptz not null default now(),
  unique (organization_id, week_start)
);

-- ============================================================================
-- Registro de actividad
-- ============================================================================
create table if not exists activity_log (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  actor_id        uuid references profiles(id) on delete set null,
  kind            text not null,            -- reply | meeting | contact | research | message
  description     text not null,
  entity          text,                     -- empresa/contacto relacionado
  created_at      timestamptz not null default now()
);
create index if not exists idx_activity_org on activity_log(organization_id, created_at desc);

-- ============================================================================
-- Row Level Security
-- ============================================================================
-- Función helper: ¿el usuario actual es agency_admin?
create or replace function is_agency_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles p
    where p.id = auth.uid() and p.role = 'agency_admin'
  );
$$;

-- Función helper: organización del usuario actual
create or replace function current_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id from profiles where id = auth.uid();
$$;

-- Macro de políticas: aplica a todas las tablas con organization_id
do $$
declare
  t text;
  org_tables text[] := array[
    'icp_profiles','companies','contacts','campaigns','email_drafts',
    'messages','meetings','deals','exclusion_list','weekly_reports','activity_log'
  ];
begin
  foreach t in array org_tables loop
    execute format('alter table %I enable row level security;', t);

    execute format('drop policy if exists "%s_select" on %I;', t, t);
    execute format($f$
      create policy "%1$s_select" on %1$I for select
      using (is_agency_admin() or organization_id = current_org_id());
    $f$, t);

    execute format('drop policy if exists "%s_modify" on %I;', t, t);
    execute format($f$
      create policy "%1$s_modify" on %1$I for all
      using (is_agency_admin() or organization_id = current_org_id())
      with check (is_agency_admin() or organization_id = current_org_id());
    $f$, t);
  end loop;
end $$;

-- organizations y profiles: políticas específicas
alter table organizations enable row level security;
drop policy if exists "orgs_select" on organizations;
create policy "orgs_select" on organizations for select
  using (is_agency_admin() or id = current_org_id());
drop policy if exists "orgs_admin" on organizations;
create policy "orgs_admin" on organizations for all
  using (is_agency_admin()) with check (is_agency_admin());

alter table profiles enable row level security;
drop policy if exists "profiles_self" on profiles;
create policy "profiles_self" on profiles for select
  using (is_agency_admin() or id = auth.uid() or organization_id = current_org_id());
drop policy if exists "profiles_admin" on profiles;
create policy "profiles_admin" on profiles for all
  using (is_agency_admin()) with check (is_agency_admin());

-- ============================================================================
-- Trigger: crea un profile automáticamente al registrarse un usuario
-- ============================================================================
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
