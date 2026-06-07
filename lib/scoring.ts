// Clasificación A/B/C: compara una empresa con el ICP y produce
// un fit_score 0-100 y un grado A/B/C.
import type { Company, IcpProfile, Contact, AccountGrade } from "./types";

export interface ScoreResult {
  score: number;
  grade: AccountGrade;
  reasons: string[];
}

/**
 * Calcula el encaje de una empresa con el ICP.
 * Ponderación: sector 30, tamaño 25, geografía 15, decisor 20, datos 10.
 */
export function scoreCompany(
  company: Pick<Company, "sector" | "employees" | "country" | "domain">,
  icp: Pick<IcpProfile, "sectors" | "employee_min" | "employee_max" | "geographies" | "decision_titles">,
  contacts: Pick<Contact, "title" | "is_decision_maker">[] = []
): ScoreResult {
  let score = 0;
  const reasons: string[] = [];

  // Sector (30)
  if (icp.sectors.length === 0) {
    score += 15;
  } else if (company.sector && matchesAny(company.sector, icp.sectors)) {
    score += 30;
    reasons.push(`Sector "${company.sector}" dentro del ICP`);
  } else {
    reasons.push("Sector fuera del ICP");
  }

  // Tamaño (25)
  const emp = company.employees ?? null;
  if (emp == null) {
    score += 8;
    reasons.push("Tamaño desconocido");
  } else {
    const min = icp.employee_min ?? 0;
    const max = icp.employee_max ?? Number.MAX_SAFE_INTEGER;
    if (emp >= min && emp <= max) {
      score += 25;
      reasons.push(`${emp} empleados dentro del rango`);
    } else {
      const dist = emp < min ? min - emp : emp - max;
      score += Math.max(0, 15 - Math.min(15, dist / 50));
      reasons.push(`${emp} empleados fuera del rango ideal`);
    }
  }

  // Geografía (15)
  if (icp.geographies.length === 0) {
    score += 10;
  } else if (company.country && matchesAny(company.country, icp.geographies)) {
    score += 15;
    reasons.push(`Geografía "${company.country}" objetivo`);
  } else {
    reasons.push("Geografía fuera del ICP");
  }

  // Decisor identificado (20)
  const hasDecisionMaker = contacts.some(
    (c) => c.is_decision_maker || (c.title && matchesAny(c.title, icp.decision_titles))
  );
  if (hasDecisionMaker) {
    score += 20;
    reasons.push("Decisor identificado");
  } else if (contacts.length > 0) {
    score += 8;
    reasons.push("Contactos sin decisor claro");
  } else {
    reasons.push("Sin contactos aún");
  }

  // Calidad de datos (10)
  if (company.domain) score += 10;

  const finalScore = Math.round(Math.min(100, score));
  return { score: finalScore, grade: gradeFromScore(finalScore), reasons };
}

export function gradeFromScore(score: number): AccountGrade {
  if (score >= 75) return "A";
  if (score >= 50) return "B";
  return "C";
}

function matchesAny(value: string, list: string[]): boolean {
  const v = value.toLowerCase();
  return list.some((item) => {
    const it = item.toLowerCase().trim();
    return it.length > 0 && (v.includes(it) || it.includes(v));
  });
}
