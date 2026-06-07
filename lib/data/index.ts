// Capa de acceso a datos.
// Si Supabase está configurado, lee de la base de datos (filtrada por RLS).
// Si no, devuelve datos semilla locales (modo demo).
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  seedOrganization, seedIcp, seedCompanies, seedContacts, seedCampaigns,
  seedDrafts, seedMessages, seedMeetings, seedDeals, seedExclusions,
  seedActivity, seedWeeklyTrend,
} from "@/lib/seed-data";
import type {
  Organization, IcpProfile, Company, Contact, Campaign, EmailDraft,
  Message, Meeting, Deal, ExclusionEntry, ActivityEntry,
} from "@/lib/types";

async function table<T>(name: string, seed: T[], order?: { col: string; asc?: boolean }): Promise<T[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return seed;
  let query = supabase.from(name).select("*");
  if (order) query = query.order(order.col, { ascending: order.asc ?? true });
  const { data, error } = await query;
  if (error || !data) return seed;
  return data as T[];
}

export async function getOrganization(): Promise<Organization> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return seedOrganization;
  const { data } = await supabase.from("organizations").select("*").limit(1).single();
  return (data as Organization) ?? seedOrganization;
}

export async function getIcp(): Promise<IcpProfile> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return seedIcp;
  const { data } = await supabase.from("icp_profiles").select("*").limit(1).single();
  return (data as IcpProfile) ?? seedIcp;
}

export const getCompanies = () => table<Company>("companies", seedCompanies, { col: "fit_score", asc: false });
export const getContacts = () => table<Contact>("contacts", seedContacts, { col: "created_at" });
export const getDrafts = () => table<EmailDraft>("email_drafts", seedDrafts, { col: "created_at", asc: false });
export const getMessages = () => table<Message>("messages", seedMessages, { col: "occurred_at", asc: false });
export const getMeetings = () => table<Meeting>("meetings", seedMeetings, { col: "scheduled_at" });
export const getDeals = () => table<Deal>("deals", seedDeals, { col: "updated_at", asc: false });
export const getExclusions = () => table<ExclusionEntry>("exclusion_list", seedExclusions, { col: "created_at", asc: false });
export const getActivity = () => table<ActivityEntry>("activity_log", seedActivity, { col: "created_at", asc: false });

export async function getCampaigns(): Promise<Campaign[]> {
  return table<Campaign>("campaigns", seedCampaigns, { col: "created_at", asc: false });
}

export function getWeeklyTrend() {
  return seedWeeklyTrend;
}

// Métricas agregadas para el dashboard.
export async function getDashboardStats() {
  const [companies, contacts, campaigns, messages, meetings] = await Promise.all([
    getCompanies(), getContacts(), getCampaigns(), getMessages(), getMeetings(),
  ]);
  const replies = messages.filter((m) => m.kind === "reply");
  const positive = replies.filter((m) => m.sentiment === "positive");
  return {
    companies: companies.length,
    gradeA: companies.filter((c) => c.grade === "A").length,
    contacts: contacts.length,
    activeCampaigns: campaigns.filter((c) => c.status === "active").length,
    replies: replies.length,
    positiveReplies: positive.length,
    meetings: meetings.length,
    replyRate: contacts.length ? Math.round((replies.length / contacts.length) * 1000) / 10 : 0,
    conversionRate: replies.length ? Math.round((positive.length / replies.length) * 1000) / 10 : 0,
  };
}
