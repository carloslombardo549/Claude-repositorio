// Datos semilla en memoria. Se usan cuando Supabase no está configurado
// (modo demo) para que la aplicación compile y se pueda explorar sin backend.
// NO contienen datos reales de clientes — son ficticios.
import type {
  Organization, IcpProfile, Company, Contact, Campaign,
  EmailDraft, Message, Meeting, Deal, ExclusionEntry, ActivityEntry,
} from "./types";

export const DEMO_ORG_ID = "00000000-0000-0000-0000-000000000001";

export const seedOrganization: Organization = {
  id: DEMO_ORG_ID,
  name: "Cliente Demo S.L.",
  website: "clientedemo.com",
  created_at: "2026-01-15T09:00:00Z",
};

export const seedIcp: IcpProfile = {
  id: "icp-1",
  organization_id: DEMO_ORG_ID,
  name: "ICP principal",
  sectors: ["Manufactura", "Logística", "Tecnología", "Salud"],
  employee_min: 100,
  employee_max: 1000,
  deal_value_min: 10000,
  geographies: ["España", "México"],
  decision_titles: ["Director General", "CEO", "CFO", "Director de Operaciones", "VP"],
  notes: "Empresas de servicios B2B con operaciones complejas y ticket medio > 10.000 €.",
  updated_at: "2026-05-20T10:00:00Z",
};

export const seedCompanies: Company[] = [
  { id: "co-1", organization_id: DEMO_ORG_ID, name: "Grupo Industrial Monterrey", domain: "grupoindustrialmonterrey.mx", sector: "Manufactura", employees: 750, size_label: "500-1000", revenue: "120M €", country: "México", city: "Monterrey", grade: "A", fit_score: 94, status: "contacted", description: "Fabricante industrial con varias plantas.", source: "apollo", created_at: "2026-04-02T09:00:00Z" },
  { id: "co-2", organization_id: DEMO_ORG_ID, name: "LogiTrans México", domain: "logitrans.mx", sector: "Logística", employees: 320, size_label: "200-500", revenue: "45M €", country: "México", city: "CDMX", grade: "A", fit_score: 87, status: "replied", description: "Operador logístico nacional.", source: "apollo", created_at: "2026-04-05T09:00:00Z" },
  { id: "co-3", organization_id: DEMO_ORG_ID, name: "Salud Integral SA", domain: "saludintegral.mx", sector: "Salud", employees: 150, size_label: "100-200", revenue: "28M €", country: "España", city: "Madrid", grade: "B", fit_score: 72, status: "researching", description: "Red de clínicas privadas.", source: "apollo", created_at: "2026-04-08T09:00:00Z" },
  { id: "co-4", organization_id: DEMO_ORG_ID, name: "Constructora Azteca", domain: "constructoraazteca.mx", sector: "Construcción", employees: 280, size_label: "200-500", revenue: "67M €", country: "México", city: "Guadalajara", grade: "B", fit_score: 58, status: "ready", description: "Constructora de obra civil.", source: "csv", created_at: "2026-04-10T09:00:00Z" },
  { id: "co-5", organization_id: DEMO_ORG_ID, name: "TechSoluciones MX", domain: "techsoluciones.mx", sector: "Tecnología", employees: 80, size_label: "50-100", revenue: "12M €", country: "España", city: "Barcelona", grade: "B", fit_score: 66, status: "won", description: "Integrador de software.", source: "apollo", created_at: "2026-04-12T09:00:00Z" },
  { id: "co-6", organization_id: DEMO_ORG_ID, name: "Distribuidora Nacional", domain: "distrinacional.mx", sector: "Distribución", employees: 600, size_label: "500-1000", revenue: "89M €", country: "México", city: "Puebla", grade: "C", fit_score: 44, status: "new", description: "Distribución de bienes de consumo.", source: "csv", created_at: "2026-04-14T09:00:00Z" },
  { id: "co-7", organization_id: DEMO_ORG_ID, name: "Pharma Innovación", domain: "pharmainnovacion.mx", sector: "Farmacéutica", employees: 410, size_label: "200-500", revenue: "156M €", country: "España", city: "Valencia", grade: "A", fit_score: 88, status: "researching", description: "Laboratorio farmacéutico.", source: "apollo", created_at: "2026-04-16T09:00:00Z" },
  { id: "co-8", organization_id: DEMO_ORG_ID, name: "Manufactura del Norte", domain: "manufnorte.mx", sector: "Manufactura", employees: 1200, size_label: "1000+", revenue: "230M €", country: "México", city: "Saltillo", grade: "A", fit_score: 95, status: "contacted", description: "Manufactura de autopartes.", source: "apollo", created_at: "2026-04-18T09:00:00Z" },
  { id: "co-9", organization_id: DEMO_ORG_ID, name: "Cadena Fría SA", domain: "cadenafria.mx", sector: "Logística", employees: 140, size_label: "100-200", revenue: "34M €", country: "México", city: "Querétaro", grade: "C", fit_score: 48, status: "new", description: "Logística refrigerada.", source: "csv", created_at: "2026-04-20T09:00:00Z" },
  { id: "co-10", organization_id: DEMO_ORG_ID, name: "BioMédica Latina", domain: "biomedicalatina.mx", sector: "Salud", employees: 360, size_label: "200-500", revenue: "78M €", country: "España", city: "Sevilla", grade: "A", fit_score: 85, status: "researching", description: "Equipamiento médico.", source: "apollo", created_at: "2026-04-22T09:00:00Z" },
];

export const seedContacts: Contact[] = [
  { id: "ct-1", organization_id: DEMO_ORG_ID, company_id: "co-1", full_name: "Carlos Mendoza Reyes", title: "Director General", email: "c.mendoza@grupoindustrialmonterrey.mx", linkedin_url: "linkedin.com/in/carlosmendoza", phone: null, seniority: "C-Level", is_decision_maker: true, status: "replied", source: "apollo", created_at: "2026-04-02T09:00:00Z" },
  { id: "ct-2", organization_id: DEMO_ORG_ID, company_id: "co-1", full_name: "Alejandra Torres Vega", title: "CFO", email: "a.torres@grupoindustrialmonterrey.mx", linkedin_url: "linkedin.com/in/alejandrat", phone: null, seniority: "C-Level", is_decision_maker: true, status: "contacted", source: "apollo", created_at: "2026-04-02T09:00:00Z" },
  { id: "ct-3", organization_id: DEMO_ORG_ID, company_id: "co-2", full_name: "Roberto Jiménez Luna", title: "Director de Operaciones", email: "r.jimenez@logitrans.mx", linkedin_url: "linkedin.com/in/robertoj", phone: null, seniority: "Director", is_decision_maker: true, status: "meeting", source: "apollo", created_at: "2026-04-05T09:00:00Z" },
  { id: "ct-4", organization_id: DEMO_ORG_ID, company_id: "co-2", full_name: "María Elena García", title: "Gerente de Compras", email: "m.garcia@logitrans.mx", linkedin_url: "linkedin.com/in/mariaelena", phone: null, seniority: "Manager", is_decision_maker: false, status: "replied", source: "apollo", created_at: "2026-04-05T09:00:00Z" },
  { id: "ct-5", organization_id: DEMO_ORG_ID, company_id: "co-3", full_name: "Fernando López Castro", title: "CEO", email: "f.lopez@saludintegral.mx", linkedin_url: "linkedin.com/in/fernandol", phone: null, seniority: "C-Level", is_decision_maker: true, status: "new", source: "apollo", created_at: "2026-04-08T09:00:00Z" },
  { id: "ct-6", organization_id: DEMO_ORG_ID, company_id: "co-3", full_name: "Patricia Ruiz Moreno", title: "Directora Médica", email: "p.ruiz@saludintegral.mx", linkedin_url: "linkedin.com/in/patriciar", phone: null, seniority: "Director", is_decision_maker: false, status: "contacted", source: "apollo", created_at: "2026-04-08T09:00:00Z" },
  { id: "ct-7", organization_id: DEMO_ORG_ID, company_id: "co-5", full_name: "Héctor Ramírez Soto", title: "VP Tecnología", email: "h.ramirez@techsoluciones.mx", linkedin_url: "linkedin.com/in/hectorr", phone: null, seniority: "VP", is_decision_maker: true, status: "meeting", source: "apollo", created_at: "2026-04-12T09:00:00Z" },
  { id: "ct-8", organization_id: DEMO_ORG_ID, company_id: "co-4", full_name: "Laura Hernández Paz", title: "Directora Comercial", email: "l.hernandez@constructoraazteca.mx", linkedin_url: "linkedin.com/in/laurah", phone: null, seniority: "Director", is_decision_maker: true, status: "replied", source: "csv", created_at: "2026-04-10T09:00:00Z" },
  { id: "ct-9", organization_id: DEMO_ORG_ID, company_id: "co-6", full_name: "Miguel Ángel Flores", title: "Gerente de Logística", email: "m.flores@distrinacional.mx", linkedin_url: "linkedin.com/in/miguelaf", phone: null, seniority: "Manager", is_decision_maker: false, status: "new", source: "csv", created_at: "2026-04-14T09:00:00Z" },
  { id: "ct-10", organization_id: DEMO_ORG_ID, company_id: "co-7", full_name: "Ana Cristina Vargas", title: "CFO", email: "a.vargas@pharmainnovacion.mx", linkedin_url: "linkedin.com/in/anacv", phone: null, seniority: "C-Level", is_decision_maker: true, status: "contacted", source: "apollo", created_at: "2026-04-16T09:00:00Z" },
  { id: "ct-11", organization_id: DEMO_ORG_ID, company_id: "co-8", full_name: "Jorge Alberto Núñez", title: "Director de Manufactura", email: "j.nunez@manufnorte.mx", linkedin_url: "linkedin.com/in/jorgen", phone: null, seniority: "Director", is_decision_maker: true, status: "replied", source: "apollo", created_at: "2026-04-18T09:00:00Z" },
  { id: "ct-12", organization_id: DEMO_ORG_ID, company_id: "co-8", full_name: "Sofía Morales Ibarra", title: "Jefa de Cadena de Suministro", email: "s.morales@manufnorte.mx", linkedin_url: "linkedin.com/in/sofiam", phone: null, seniority: "Manager", is_decision_maker: false, status: "meeting", source: "apollo", created_at: "2026-04-18T09:00:00Z" },
  { id: "ct-13", organization_id: DEMO_ORG_ID, company_id: "co-10", full_name: "Valentina Cruz Ríos", title: "Directora de Innovación", email: "v.cruz@biomedicalatina.mx", linkedin_url: "linkedin.com/in/valentinac", phone: null, seniority: "Director", is_decision_maker: true, status: "contacted", source: "apollo", created_at: "2026-04-22T09:00:00Z" },
  { id: "ct-14", organization_id: DEMO_ORG_ID, company_id: "co-10", full_name: "Ricardo Padilla Ortiz", title: "Director General", email: "r.padilla@biomedicalatina.mx", linkedin_url: "linkedin.com/in/ricardop", phone: null, seniority: "C-Level", is_decision_maker: true, status: "replied", source: "apollo", created_at: "2026-04-22T09:00:00Z" },
];

export const seedCampaigns: Campaign[] = [
  { id: "cp-1", organization_id: DEMO_ORG_ID, name: "Manufactura Q2 2026", description: "Empresas de manufactura con +200 empleados.", channel: "email", status: "active", start_date: "2026-04-01", end_date: "2026-06-30", created_at: "2026-04-01T09:00:00Z", targets: 89, replies: 12, meetings: 4 },
  { id: "cp-2", organization_id: DEMO_ORG_ID, name: "Logística Digital", description: "Directores de operaciones y logística.", channel: "email", status: "active", start_date: "2026-04-15", end_date: "2026-07-15", created_at: "2026-04-15T09:00:00Z", targets: 67, replies: 18, meetings: 3 },
  { id: "cp-3", organization_id: DEMO_ORG_ID, name: "Salud Corporativa", description: "Hospitales y clínicas privadas.", channel: "email", status: "paused", start_date: "2026-03-01", end_date: "2026-05-31", created_at: "2026-03-01T09:00:00Z", targets: 45, replies: 7, meetings: 0 },
];

export const seedDrafts: EmailDraft[] = [
  { id: "dr-1", organization_id: DEMO_ORG_ID, contact_id: "ct-5", campaign_id: "cp-3", subject: "Optimización administrativa en Salud Integral", body: "Hola Fernando,\n\nVi que Salud Integral está expandiendo su red de clínicas. Ayudamos a operadores sanitarios a reducir un 30% la carga administrativa.\n\n¿Tendría sentido una llamada de 15 min esta semana?\n\nUn saludo,", status: "pending_approval", approved_by: null, approved_at: null, created_at: "2026-05-28T10:00:00Z" },
  { id: "dr-2", organization_id: DEMO_ORG_ID, contact_id: "ct-9", campaign_id: "cp-2", subject: "Trazabilidad de cadena en Distribuidora Nacional", body: "Hola Miguel Ángel,\n\nTrabajamos con operadores logísticos para dar visibilidad en tiempo real a su cadena. ¿Te interesa ver un caso similar al vuestro?\n\nGracias,", status: "pending_approval", approved_by: null, approved_at: null, created_at: "2026-05-29T11:00:00Z" },
  { id: "dr-3", organization_id: DEMO_ORG_ID, contact_id: "ct-2", campaign_id: "cp-1", subject: "Control de costes para Grupo Industrial", body: "Hola Alejandra,\n\nComo CFO de un grupo industrial multi-planta, imagino que la consolidación de costes es prioridad. Tenemos un enfoque que encaja.\n\n¿Hablamos?", status: "approved", approved_by: null, approved_at: "2026-05-30T09:00:00Z", created_at: "2026-05-27T09:00:00Z" },
  { id: "dr-4", organization_id: DEMO_ORG_ID, contact_id: "ct-13", campaign_id: "cp-3", subject: "Innovación en BioMédica Latina", body: "Hola Valentina,\n\nBorrador inicial para revisar.", status: "draft", approved_by: null, approved_at: null, created_at: "2026-05-31T09:00:00Z" },
];

export const seedMessages: Message[] = [
  { id: "ms-1", organization_id: DEMO_ORG_ID, contact_id: "ct-1", campaign_id: "cp-1", draft_id: null, kind: "outbound", subject: "Control de costes", body: "Email enviado.", sentiment: "unknown", occurred_at: "2026-05-25T09:00:00Z" },
  { id: "ms-2", organization_id: DEMO_ORG_ID, contact_id: "ct-1", campaign_id: "cp-1", draft_id: null, kind: "reply", subject: "RE: Control de costes", body: "Gracias por el mensaje, me interesa. ¿Podemos vernos el jueves?", sentiment: "positive", occurred_at: "2026-05-26T14:00:00Z" },
  { id: "ms-3", organization_id: DEMO_ORG_ID, contact_id: "ct-4", campaign_id: "cp-2", draft_id: null, kind: "reply", subject: "RE: Trazabilidad", body: "Ahora mismo no es prioridad, quizá más adelante.", sentiment: "neutral", occurred_at: "2026-05-27T10:00:00Z" },
  { id: "ms-4", organization_id: DEMO_ORG_ID, contact_id: "ct-11", campaign_id: "cp-1", draft_id: null, kind: "reply", subject: "RE: Manufactura", body: "Suena interesante, paso vuestros datos al equipo.", sentiment: "positive", occurred_at: "2026-05-28T12:00:00Z" },
  { id: "ms-5", organization_id: DEMO_ORG_ID, contact_id: "ct-8", campaign_id: "cp-1", draft_id: null, kind: "reply", subject: "RE: Costes", body: "No estamos interesados, gracias.", sentiment: "negative", occurred_at: "2026-05-29T09:00:00Z" },
];

export const seedMeetings: Meeting[] = [
  { id: "mt-1", organization_id: DEMO_ORG_ID, contact_id: "ct-3", company_id: "co-2", scheduled_at: "2026-06-10T11:00:00Z", status: "scheduled", notes: "Demo inicial de la plataforma." },
  { id: "mt-2", organization_id: DEMO_ORG_ID, contact_id: "ct-7", company_id: "co-5", scheduled_at: "2026-06-12T16:00:00Z", status: "scheduled", notes: "Reunión técnica." },
  { id: "mt-3", organization_id: DEMO_ORG_ID, contact_id: "ct-1", company_id: "co-1", scheduled_at: "2026-06-05T10:00:00Z", status: "completed", notes: "Buena recepción, piden propuesta." },
  { id: "mt-4", organization_id: DEMO_ORG_ID, contact_id: "ct-12", company_id: "co-8", scheduled_at: "2026-06-13T09:30:00Z", status: "scheduled", notes: "Presentación al comité." },
];

export const seedDeals: Deal[] = [
  { id: "dl-1", organization_id: DEMO_ORG_ID, company_id: "co-1", contact_id: "ct-1", title: "Grupo Industrial Monterrey", stage: "proposal", value: 48000, updated_at: "2026-06-05T10:00:00Z" },
  { id: "dl-2", organization_id: DEMO_ORG_ID, company_id: "co-2", contact_id: "ct-3", title: "LogiTrans México", stage: "meeting", value: 32000, updated_at: "2026-06-03T10:00:00Z" },
  { id: "dl-3", organization_id: DEMO_ORG_ID, company_id: "co-8", contact_id: "ct-11", title: "Manufactura del Norte", stage: "qualified", value: 75000, updated_at: "2026-06-02T10:00:00Z" },
  { id: "dl-4", organization_id: DEMO_ORG_ID, company_id: "co-5", contact_id: "ct-7", title: "TechSoluciones MX", stage: "won", value: 26000, updated_at: "2026-05-20T10:00:00Z" },
  { id: "dl-5", organization_id: DEMO_ORG_ID, company_id: "co-7", contact_id: "ct-10", title: "Pharma Innovación", stage: "lead", value: 40000, updated_at: "2026-06-01T10:00:00Z" },
  { id: "dl-6", organization_id: DEMO_ORG_ID, company_id: "co-10", contact_id: "ct-13", title: "BioMédica Latina", stage: "qualified", value: 38000, updated_at: "2026-05-30T10:00:00Z" },
  { id: "dl-7", organization_id: DEMO_ORG_ID, company_id: "co-4", contact_id: "ct-8", title: "Constructora Azteca", stage: "lost", value: 0, updated_at: "2026-05-15T10:00:00Z" },
];

export const seedExclusions: ExclusionEntry[] = [
  { id: "ex-1", organization_id: DEMO_ORG_ID, type: "domain", value: "competidor.com", reason: "Competidor directo", created_at: "2026-05-01T09:00:00Z" },
  { id: "ex-2", organization_id: DEMO_ORG_ID, type: "email", value: "no-contactar@ejemplo.com", reason: "Solicitó no ser contactado", created_at: "2026-05-10T09:00:00Z" },
  { id: "ex-3", organization_id: DEMO_ORG_ID, type: "company", value: "Cliente Existente SA", reason: "Ya es cliente", created_at: "2026-05-12T09:00:00Z" },
];

export const seedActivity: ActivityEntry[] = [
  { id: "ac-1", organization_id: DEMO_ORG_ID, kind: "reply", description: "Carlos Mendoza respondió positivamente", entity: "Grupo Industrial Monterrey", created_at: "2026-06-06T12:00:00Z" },
  { id: "ac-2", organization_id: DEMO_ORG_ID, kind: "meeting", description: "Reunión agendada con Roberto Jiménez", entity: "LogiTrans México", created_at: "2026-06-06T10:00:00Z" },
  { id: "ac-3", organization_id: DEMO_ORG_ID, kind: "contact", description: "Nuevo contacto: Sofía Morales", entity: "Manufactura del Norte", created_at: "2026-06-05T18:00:00Z" },
  { id: "ac-4", organization_id: DEMO_ORG_ID, kind: "research", description: "Cuenta investigada y clasificada A", entity: "BioMédica Latina", created_at: "2026-06-05T15:00:00Z" },
  { id: "ac-5", organization_id: DEMO_ORG_ID, kind: "message", description: "5 borradores generados para revisión", entity: "Campaña Logística Digital", created_at: "2026-06-05T11:00:00Z" },
];

export const seedWeeklyTrend = [
  { semana: "Sem 1", contactos: 18, respuestas: 3, reuniones: 0 },
  { semana: "Sem 2", contactos: 24, respuestas: 5, reuniones: 1 },
  { semana: "Sem 3", contactos: 31, respuestas: 7, reuniones: 2 },
  { semana: "Sem 4", contactos: 28, respuestas: 8, reuniones: 1 },
  { semana: "Sem 5", contactos: 35, respuestas: 6, reuniones: 2 },
  { semana: "Sem 6", contactos: 42, respuestas: 9, reuniones: 3 },
  { semana: "Sem 7", contactos: 38, respuestas: 11, reuniones: 2 },
  { semana: "Sem 8", contactos: 45, respuestas: 10, reuniones: 4 },
];
