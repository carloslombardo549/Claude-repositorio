"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEMO_ORG_ID } from "@/lib/seed-data";
import { scoreCompany } from "@/lib/scoring";
import {
  icpSchema, exclusionSchema, draftSchema, campaignSchema,
  type IcpInput, type ExclusionInput, type DraftInput, type CampaignInput,
} from "@/lib/validation/schemas";
import type { ApolloRow } from "@/lib/validation/schemas";
import type { IcpProfile } from "@/lib/types";

export interface ActionResult {
  ok: boolean;
  demo?: boolean;        // true cuando no hay Supabase configurado
  error?: string;
  inserted?: number;
}

// Resuelve el contexto de sesión (cliente Supabase + organización del usuario).
// Devuelve null en modo demo (sin Supabase).
async function sessionContext() {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles").select("organization_id, role").eq("id", user.id).single();

  let orgId = profile?.organization_id ?? null;
  // Un admin de agencia sin organización asignada cae en la primera disponible.
  if (!orgId) {
    const { data: org } = await supabase.from("organizations").select("id").limit(1).single();
    orgId = org?.id ?? DEMO_ORG_ID;
  }

  return { supabase, orgId, userId: user.id };
}

// --- ICP -------------------------------------------------------------------
export async function saveIcpAction(input: IcpInput): Promise<ActionResult> {
  const parsed = icpSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };

  const ctx = await sessionContext();
  if (!ctx) return { ok: true, demo: true };

  const { data: existing } = await ctx.supabase
    .from("icp_profiles").select("id").eq("organization_id", ctx.orgId).limit(1).single();

  const payload = { ...parsed.data, organization_id: ctx.orgId, updated_at: new Date().toISOString() };
  const { error } = existing
    ? await ctx.supabase.from("icp_profiles").update(payload).eq("id", existing.id)
    : await ctx.supabase.from("icp_profiles").insert(payload);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/configuracion");
  revalidatePath("/empresas");
  return { ok: true };
}

// --- Lista de exclusión ----------------------------------------------------
export async function addExclusionAction(input: ExclusionInput): Promise<ActionResult> {
  const parsed = exclusionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };

  const ctx = await sessionContext();
  if (!ctx) return { ok: true, demo: true };

  const { error } = await ctx.supabase
    .from("exclusion_list")
    .insert({ ...parsed.data, organization_id: ctx.orgId });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/configuracion");
  return { ok: true };
}

export async function removeExclusionAction(id: string): Promise<ActionResult> {
  const ctx = await sessionContext();
  if (!ctx) return { ok: true, demo: true };
  const { error } = await ctx.supabase.from("exclusion_list").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/configuracion");
  return { ok: true };
}

// --- Borradores de email ---------------------------------------------------
export async function createDraftAction(input: DraftInput): Promise<ActionResult> {
  const parsed = draftSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };

  const ctx = await sessionContext();
  if (!ctx) return { ok: true, demo: true };

  const { error } = await ctx.supabase.from("email_drafts").insert({
    organization_id: ctx.orgId,
    contact_id: parsed.data.contact_id,
    campaign_id: parsed.data.campaign_id ?? null,
    subject: parsed.data.subject,
    body: parsed.data.body,
    status: "pending_approval",
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/generador");
  return { ok: true };
}

export async function setDraftStatusAction(
  id: string,
  status: "approved" | "rejected"
): Promise<ActionResult> {
  const ctx = await sessionContext();
  if (!ctx) return { ok: true, demo: true };

  const { error } = await ctx.supabase.from("email_drafts").update({
    status,
    approved_by: status === "approved" ? ctx.userId : null,
    approved_at: status === "approved" ? new Date().toISOString() : null,
  }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/generador");
  return { ok: true };
}

// --- Campañas --------------------------------------------------------------
export async function createCampaignAction(input: CampaignInput): Promise<ActionResult> {
  const parsed = campaignSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };

  const ctx = await sessionContext();
  if (!ctx) return { ok: true, demo: true };

  const { error } = await ctx.supabase.from("campaigns").insert({
    ...parsed.data,
    organization_id: ctx.orgId,
    status: "draft",
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/campanas");
  return { ok: true };
}

// --- Importación CSV de Apollo (persistente) -------------------------------
// Inserta empresas (deduplicadas) y sus contactos, clasificando A/B/C contra el ICP.
export async function importApolloAction(rows: ApolloRow[]): Promise<ActionResult> {
  const ctx = await sessionContext();
  if (!ctx) return { ok: true, demo: true, inserted: rows.length };

  // ICP de la organización para clasificar.
  const { data: icpRow } = await ctx.supabase
    .from("icp_profiles").select("*").eq("organization_id", ctx.orgId).limit(1).single();
  const icp = (icpRow as IcpProfile) ?? {
    sectors: [], employee_min: null, employee_max: null,
    geographies: [], decision_titles: [],
  } as Pick<IcpProfile, "sectors" | "employee_min" | "employee_max" | "geographies" | "decision_titles">;

  // Empresas existentes para deduplicar por nombre.
  const { data: existingCompanies } = await ctx.supabase
    .from("companies").select("id, name").eq("organization_id", ctx.orgId);
  const companyByName = new Map(
    (existingCompanies ?? []).map((c: { id: string; name: string }) => [c.name.toLowerCase(), c.id])
  );

  let inserted = 0;

  for (const row of rows) {
    if (!row.company && !row.email) continue;
    const domain = row.website?.replace(/^https?:\/\//, "").replace(/\/.*$/, "") || null;
    let companyId = row.company ? companyByName.get(row.company.toLowerCase()) ?? null : null;

    if (!companyId && row.company) {
      const { score, grade } = scoreCompany(
        { sector: row.industry || null, employees: row.employees ?? null, country: row.country || null, domain },
        icp,
        [{ title: row.title || null, is_decision_maker: false }]
      );
      const { data: newCo } = await ctx.supabase.from("companies").insert({
        organization_id: ctx.orgId,
        name: row.company,
        domain,
        sector: row.industry || null,
        employees: row.employees ?? null,
        country: row.country || null,
        city: row.city || null,
        grade,
        fit_score: score,
        status: "new",
        source: "apollo",
      }).select("id").single();
      companyId = newCo?.id ?? null;
      if (companyId) companyByName.set(row.company.toLowerCase(), companyId);
    }

    const fullName = [row.first_name, row.last_name].filter(Boolean).join(" ").trim();
    if (!fullName) continue;

    const isDecisionMaker = (icp.decision_titles ?? []).some(
      (t) => row.title && row.title.toLowerCase().includes(t.toLowerCase())
    );

    const { error } = await ctx.supabase.from("contacts").insert({
      organization_id: ctx.orgId,
      company_id: companyId,
      full_name: fullName,
      title: row.title || null,
      email: row.email || null,
      linkedin_url: row.linkedin_url || null,
      is_decision_maker: isDecisionMaker,
      status: "new",
      source: "apollo",
    });
    if (!error) inserted++;
  }

  revalidatePath("/empresas");
  revalidatePath("/contactos");
  return { ok: true, inserted };
}
