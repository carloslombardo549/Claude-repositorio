// Tipos de dominio compartidos por toda la aplicación.
// Reflejan el esquema de Supabase (supabase/migrations/0001_init.sql).

export type UserRole = "agency_admin" | "client_user";
export type AccountGrade = "A" | "B" | "C" | "unrated";
export type CompanyStatus =
  | "new" | "researching" | "ready" | "contacted" | "replied" | "won" | "lost" | "excluded";
export type ContactStatus =
  | "new" | "queued" | "contacted" | "replied" | "meeting" | "unsubscribed";
export type CampaignStatus = "draft" | "active" | "paused" | "finished";
export type DraftStatus = "draft" | "pending_approval" | "approved" | "rejected" | "sent";
export type MessageKind = "outbound" | "reply";
export type MessageSentiment = "positive" | "neutral" | "negative" | "ooo" | "unknown";
export type MeetingStatus = "scheduled" | "completed" | "no_show" | "cancelled";
export type DealStage = "lead" | "qualified" | "meeting" | "proposal" | "won" | "lost";
export type ExclusionType = "email" | "domain" | "company";

export interface Organization {
  id: string;
  name: string;
  website: string | null;
  created_at: string;
}

export interface IcpProfile {
  id: string;
  organization_id: string;
  name: string;
  sectors: string[];
  employee_min: number | null;
  employee_max: number | null;
  deal_value_min: number;
  geographies: string[];
  decision_titles: string[];
  notes: string | null;
  updated_at: string;
}

export interface Company {
  id: string;
  organization_id: string;
  name: string;
  domain: string | null;
  sector: string | null;
  employees: number | null;
  size_label: string | null;
  revenue: string | null;
  country: string | null;
  city: string | null;
  grade: AccountGrade;
  fit_score: number;
  status: CompanyStatus;
  description: string | null;
  source: string;
  created_at: string;
}

export interface Contact {
  id: string;
  organization_id: string;
  company_id: string | null;
  full_name: string;
  title: string | null;
  email: string | null;
  linkedin_url: string | null;
  phone: string | null;
  seniority: string | null;
  is_decision_maker: boolean;
  status: ContactStatus;
  source: string;
  created_at: string;
}

export interface Campaign {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  channel: string;
  status: CampaignStatus;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  // métricas derivadas (no en BD)
  targets?: number;
  replies?: number;
  meetings?: number;
}

export interface EmailDraft {
  id: string;
  organization_id: string;
  contact_id: string;
  campaign_id: string | null;
  subject: string;
  body: string;
  status: DraftStatus;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  organization_id: string;
  contact_id: string;
  campaign_id: string | null;
  draft_id: string | null;
  kind: MessageKind;
  subject: string | null;
  body: string | null;
  sentiment: MessageSentiment;
  occurred_at: string;
}

export interface Meeting {
  id: string;
  organization_id: string;
  contact_id: string;
  company_id: string | null;
  scheduled_at: string;
  status: MeetingStatus;
  notes: string | null;
}

export interface Deal {
  id: string;
  organization_id: string;
  company_id: string | null;
  contact_id: string | null;
  title: string;
  stage: DealStage;
  value: number;
  updated_at: string;
}

export interface ExclusionEntry {
  id: string;
  organization_id: string;
  type: ExclusionType;
  value: string;
  reason: string | null;
  created_at: string;
}

export interface ActivityEntry {
  id: string;
  organization_id: string;
  kind: string;
  description: string;
  entity: string | null;
  created_at: string;
}
