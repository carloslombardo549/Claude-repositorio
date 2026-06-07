-- ============================================================================
-- Datos semilla ficticios para Supabase. NO contienen datos reales de clientes.
-- Ejecutar después de 0001_init.sql. Idempotente (usa upserts por id fijo).
-- ============================================================================

-- Organización demo
insert into organizations (id, name, website) values
  ('00000000-0000-0000-0000-000000000001', 'Cliente Demo S.L.', 'clientedemo.com')
on conflict (id) do nothing;

-- ICP
insert into icp_profiles (id, organization_id, name, sectors, employee_min, employee_max, deal_value_min, geographies, decision_titles, notes)
values (
  '00000000-0000-0000-0000-0000000000a1',
  '00000000-0000-0000-0000-000000000001',
  'ICP principal',
  array['Manufactura','Logística','Tecnología','Salud'],
  100, 1000, 10000,
  array['España','México'],
  array['Director General','CEO','CFO','Director de Operaciones','VP'],
  'Empresas de servicios B2B con operaciones complejas y ticket medio > 10.000 €.'
) on conflict (id) do nothing;

-- Empresas
insert into companies (id, organization_id, name, domain, sector, employees, size_label, revenue, country, city, grade, fit_score, status, source) values
  ('00000000-0000-0000-0000-0000000000c1','00000000-0000-0000-0000-000000000001','Grupo Industrial Monterrey','grupoindustrialmonterrey.mx','Manufactura',750,'500-1000','120M €','México','Monterrey','A',94,'contacted','apollo'),
  ('00000000-0000-0000-0000-0000000000c2','00000000-0000-0000-0000-000000000001','LogiTrans México','logitrans.mx','Logística',320,'200-500','45M €','México','CDMX','A',87,'replied','apollo'),
  ('00000000-0000-0000-0000-0000000000c3','00000000-0000-0000-0000-000000000001','Salud Integral SA','saludintegral.mx','Salud',150,'100-200','28M €','España','Madrid','B',72,'researching','apollo'),
  ('00000000-0000-0000-0000-0000000000c4','00000000-0000-0000-0000-000000000001','Constructora Azteca','constructoraazteca.mx','Construcción',280,'200-500','67M €','México','Guadalajara','B',58,'ready','csv'),
  ('00000000-0000-0000-0000-0000000000c5','00000000-0000-0000-0000-000000000001','TechSoluciones MX','techsoluciones.mx','Tecnología',80,'50-100','12M €','España','Barcelona','B',66,'won','apollo'),
  ('00000000-0000-0000-0000-0000000000c7','00000000-0000-0000-0000-000000000001','Pharma Innovación','pharmainnovacion.mx','Farmacéutica',410,'200-500','156M €','España','Valencia','A',88,'researching','apollo'),
  ('00000000-0000-0000-0000-0000000000c8','00000000-0000-0000-0000-000000000001','Manufactura del Norte','manufnorte.mx','Manufactura',1200,'1000+','230M €','México','Saltillo','A',95,'contacted','apollo')
on conflict (id) do nothing;

-- Contactos
insert into contacts (id, organization_id, company_id, full_name, title, email, linkedin_url, seniority, is_decision_maker, status, source) values
  ('00000000-0000-0000-0000-0000000000d1','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000c1','Carlos Mendoza Reyes','Director General','c.mendoza@grupoindustrialmonterrey.mx','linkedin.com/in/carlosmendoza','C-Level',true,'replied','apollo'),
  ('00000000-0000-0000-0000-0000000000d2','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000c1','Alejandra Torres Vega','CFO','a.torres@grupoindustrialmonterrey.mx','linkedin.com/in/alejandrat','C-Level',true,'contacted','apollo'),
  ('00000000-0000-0000-0000-0000000000d3','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000c2','Roberto Jiménez Luna','Director de Operaciones','r.jimenez@logitrans.mx','linkedin.com/in/robertoj','Director',true,'meeting','apollo'),
  ('00000000-0000-0000-0000-0000000000d5','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000c3','Fernando López Castro','CEO','f.lopez@saludintegral.mx','linkedin.com/in/fernandol','C-Level',true,'new','apollo'),
  ('00000000-0000-0000-0000-0000000000d7','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000c5','Héctor Ramírez Soto','VP Tecnología','h.ramirez@techsoluciones.mx','linkedin.com/in/hectorr','VP',true,'meeting','apollo'),
  ('00000000-0000-0000-0000-0000000000da','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000c7','Ana Cristina Vargas','CFO','a.vargas@pharmainnovacion.mx','linkedin.com/in/anacv','C-Level',true,'contacted','apollo'),
  ('00000000-0000-0000-0000-0000000000db','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000c8','Jorge Alberto Núñez','Director de Manufactura','j.nunez@manufnorte.mx','linkedin.com/in/jorgen','Director',true,'replied','apollo')
on conflict (id) do nothing;

-- Campañas
insert into campaigns (id, organization_id, name, description, channel, status, start_date, end_date) values
  ('00000000-0000-0000-0000-0000000000e1','00000000-0000-0000-0000-000000000001','Manufactura Q2 2026','Empresas de manufactura con +200 empleados.','email','active','2026-04-01','2026-06-30'),
  ('00000000-0000-0000-0000-0000000000e2','00000000-0000-0000-0000-000000000001','Logística Digital','Directores de operaciones y logística.','email','active','2026-04-15','2026-07-15'),
  ('00000000-0000-0000-0000-0000000000e3','00000000-0000-0000-0000-000000000001','Salud Corporativa','Hospitales y clínicas privadas.','email','paused','2026-03-01','2026-05-31')
on conflict (id) do nothing;

-- Borradores (flujo de aprobación)
insert into email_drafts (id, organization_id, contact_id, campaign_id, subject, body, status) values
  ('00000000-0000-0000-0000-0000000000f1','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000d5','00000000-0000-0000-0000-0000000000e3','Optimización administrativa en Salud Integral','Hola Fernando, ayudamos a operadores sanitarios a reducir la carga administrativa. ¿Hablamos 15 min?','pending_approval'),
  ('00000000-0000-0000-0000-0000000000f2','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000d2','00000000-0000-0000-0000-0000000000e1','Control de costes para Grupo Industrial','Hola Alejandra, como CFO de un grupo multi-planta imagino que la consolidación de costes es prioridad.','approved')
on conflict (id) do nothing;

-- Mensajes (enviados y respuestas)
insert into messages (id, organization_id, contact_id, campaign_id, kind, subject, body, sentiment, occurred_at) values
  ('00000000-0000-0000-0000-000000000a01','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000d1','00000000-0000-0000-0000-0000000000e1','outbound','Control de costes','Email enviado.','unknown','2026-05-25T09:00:00Z'),
  ('00000000-0000-0000-0000-000000000a02','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000d1','00000000-0000-0000-0000-0000000000e1','reply','RE: Control de costes','Me interesa, ¿podemos vernos el jueves?','positive','2026-05-26T14:00:00Z'),
  ('00000000-0000-0000-0000-000000000a04','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000db','00000000-0000-0000-0000-0000000000e1','reply','RE: Manufactura','Suena interesante, paso vuestros datos al equipo.','positive','2026-05-28T12:00:00Z')
on conflict (id) do nothing;

-- Reuniones
insert into meetings (id, organization_id, contact_id, company_id, scheduled_at, status, notes) values
  ('00000000-0000-0000-0000-000000000b01','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000d3','00000000-0000-0000-0000-0000000000c2','2026-06-10T11:00:00Z','scheduled','Demo inicial de la plataforma.'),
  ('00000000-0000-0000-0000-000000000b02','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000d7','00000000-0000-0000-0000-0000000000c5','2026-06-12T16:00:00Z','scheduled','Reunión técnica.'),
  ('00000000-0000-0000-0000-000000000b03','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000d1','00000000-0000-0000-0000-0000000000c1','2026-06-05T10:00:00Z','completed','Buena recepción, piden propuesta.')
on conflict (id) do nothing;

-- Pipeline
insert into deals (id, organization_id, company_id, contact_id, title, stage, value) values
  ('00000000-0000-0000-0000-000000000c01','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000c1','00000000-0000-0000-0000-0000000000d1','Grupo Industrial Monterrey','proposal',48000),
  ('00000000-0000-0000-0000-000000000c02','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000c2','00000000-0000-0000-0000-0000000000d3','LogiTrans México','meeting',32000),
  ('00000000-0000-0000-0000-000000000c03','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000c8','00000000-0000-0000-0000-0000000000db','Manufactura del Norte','qualified',75000),
  ('00000000-0000-0000-0000-000000000c04','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000c5','00000000-0000-0000-0000-0000000000d7','TechSoluciones MX','won',26000)
on conflict (id) do nothing;

-- Lista de exclusión
insert into exclusion_list (id, organization_id, type, value, reason) values
  ('00000000-0000-0000-0000-000000000d01','00000000-0000-0000-0000-000000000001','domain','competidor.com','Competidor directo'),
  ('00000000-0000-0000-0000-000000000d02','00000000-0000-0000-0000-000000000001','email','no-contactar@ejemplo.com','Solicitó no ser contactado')
on conflict (id) do nothing;

-- Actividad
insert into activity_log (id, organization_id, kind, description, entity) values
  ('00000000-0000-0000-0000-000000000e01','00000000-0000-0000-0000-000000000001','reply','Carlos Mendoza respondió positivamente','Grupo Industrial Monterrey'),
  ('00000000-0000-0000-0000-000000000e02','00000000-0000-0000-0000-000000000001','meeting','Reunión agendada con Roberto Jiménez','LogiTrans México'),
  ('00000000-0000-0000-0000-000000000e03','00000000-0000-0000-0000-000000000001','research','Cuenta investigada y clasificada A','BioMédica Latina')
on conflict (id) do nothing;
