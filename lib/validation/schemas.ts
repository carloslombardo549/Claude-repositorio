// Esquemas de validación Zod para formularios, server actions e importación CSV.
import { z } from "zod";

export const icpSchema = z.object({
  name: z.string().min(2, "Nombre demasiado corto"),
  sectors: z.array(z.string()).default([]),
  employee_min: z.coerce.number().int().nonnegative().nullable().optional(),
  employee_max: z.coerce.number().int().nonnegative().nullable().optional(),
  deal_value_min: z.coerce.number().nonnegative().default(10000),
  geographies: z.array(z.string()).default([]),
  decision_titles: z.array(z.string()).default([]),
  notes: z.string().max(2000).nullable().optional(),
});
export type IcpInput = z.infer<typeof icpSchema>;

export const companySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  domain: z.string().nullable().optional(),
  sector: z.string().nullable().optional(),
  employees: z.coerce.number().int().nonnegative().nullable().optional(),
  size_label: z.string().nullable().optional(),
  revenue: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});
export type CompanyInput = z.infer<typeof companySchema>;

export const contactSchema = z.object({
  full_name: z.string().min(1, "El nombre es obligatorio"),
  title: z.string().nullable().optional(),
  email: z.string().email("Email inválido").nullable().optional().or(z.literal("")),
  linkedin_url: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  seniority: z.string().nullable().optional(),
  is_decision_maker: z.boolean().default(false),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const campaignSchema = z.object({
  name: z.string().min(2, "Nombre demasiado corto"),
  description: z.string().nullable().optional(),
  channel: z.string().default("email"),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
});
export type CampaignInput = z.infer<typeof campaignSchema>;

export const draftSchema = z.object({
  contact_id: z.string().min(1),
  campaign_id: z.string().nullable().optional(),
  subject: z.string().min(1, "El asunto es obligatorio"),
  body: z.string().min(1, "El cuerpo es obligatorio"),
});
export type DraftInput = z.infer<typeof draftSchema>;

export const exclusionSchema = z.object({
  type: z.enum(["email", "domain", "company"]),
  value: z.string().min(1, "Valor obligatorio"),
  reason: z.string().nullable().optional(),
});
export type ExclusionInput = z.infer<typeof exclusionSchema>;

// ---------------------------------------------------------------------------
// Importación CSV de Apollo. Apollo exporta cabeceras como
// "First Name", "Last Name", "Title", "Company", "Email", "Employees"...
// Normalizamos a este esquema una vez mapeadas las columnas.
// ---------------------------------------------------------------------------
export const apolloRowSchema = z.object({
  first_name: z.string().optional().default(""),
  last_name: z.string().optional().default(""),
  title: z.string().optional().default(""),
  company: z.string().optional().default(""),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  linkedin_url: z.string().optional().default(""),
  employees: z.coerce.number().int().nonnegative().optional().nullable(),
  industry: z.string().optional().default(""),
  country: z.string().optional().default(""),
  city: z.string().optional().default(""),
  website: z.string().optional().default(""),
});
export type ApolloRow = z.infer<typeof apolloRowSchema>;

// Mapa de cabeceras de Apollo → campos normalizados.
export const APOLLO_HEADER_MAP: Record<string, keyof ApolloRow> = {
  "first name": "first_name",
  "last name": "last_name",
  "title": "title",
  "company": "company",
  "company name": "company",
  "company name for emails": "company",
  "email": "email",
  "person linkedin url": "linkedin_url",
  "linkedin url": "linkedin_url",
  "# employees": "employees",
  "employees": "employees",
  "industry": "industry",
  "country": "country",
  "city": "city",
  "website": "website",
  "company website": "website",
};
