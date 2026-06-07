// Traducciones legibles de los valores enum a español.
export const companyStatusLabel: Record<string, string> = {
  new: "Nueva", researching: "Investigando", ready: "Lista",
  contacted: "Contactada", replied: "Respondió", won: "Ganada",
  lost: "Perdida", excluded: "Excluida",
};

export const contactStatusLabel: Record<string, string> = {
  new: "Nuevo", queued: "En cola", contacted: "Contactado",
  replied: "Respondió", meeting: "Reunión", unsubscribed: "Baja",
};

export const campaignStatusLabel: Record<string, string> = {
  draft: "Borrador", active: "Activa", paused: "Pausada", finished: "Finalizada",
};

export const draftStatusLabel: Record<string, string> = {
  draft: "Borrador", pending_approval: "Pendiente de aprobación",
  approved: "Aprobado", rejected: "Rechazado", sent: "Enviado",
};

export const sentimentLabel: Record<string, string> = {
  positive: "Positiva", neutral: "Neutral", negative: "Negativa",
  ooo: "Fuera de oficina", unknown: "Sin clasificar",
};

export const meetingStatusLabel: Record<string, string> = {
  scheduled: "Agendada", completed: "Completada",
  no_show: "No asistió", cancelled: "Cancelada",
};

export const dealStageLabel: Record<string, string> = {
  lead: "Lead", qualified: "Cualificado", meeting: "Reunión",
  proposal: "Propuesta", won: "Ganado", lost: "Perdido",
};

export const exclusionTypeLabel: Record<string, string> = {
  email: "Email", domain: "Dominio", company: "Empresa",
};
