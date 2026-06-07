// Normalización de filas exportadas desde Apollo.
import { apolloRowSchema, APOLLO_HEADER_MAP, type ApolloRow } from "./validation/schemas";

export interface NormalizedRow {
  raw: Record<string, string>;
  data: ApolloRow | null;
  errors: string[];
  rowIndex: number;
}

// Convierte una fila cruda (objeto cabecera→valor) al esquema normalizado.
export function normalizeApolloRow(raw: Record<string, string>, rowIndex: number): NormalizedRow {
  const mapped: Record<string, unknown> = {};
  for (const [header, value] of Object.entries(raw)) {
    const key = APOLLO_HEADER_MAP[header.trim().toLowerCase()];
    if (key) mapped[key] = typeof value === "string" ? value.trim() : value;
  }

  const result = apolloRowSchema.safeParse(mapped);
  if (!result.success) {
    return {
      raw,
      data: null,
      rowIndex,
      errors: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    };
  }
  return { raw, data: result.data, errors: [], rowIndex };
}

export function fullName(row: ApolloRow): string {
  return [row.first_name, row.last_name].filter(Boolean).join(" ").trim();
}

// Determina si un contacto debe excluirse por la lista de no contactar.
export function isExcluded(
  email: string | undefined,
  domain: string | undefined,
  company: string | undefined,
  exclusions: { type: string; value: string }[]
): boolean {
  const e = (email ?? "").toLowerCase();
  const d = (domain ?? "").toLowerCase();
  const c = (company ?? "").toLowerCase();
  return exclusions.some((ex) => {
    const v = ex.value.toLowerCase();
    if (ex.type === "email") return e === v;
    if (ex.type === "domain") return d === v || e.endsWith("@" + v);
    if (ex.type === "company") return c === v;
    return false;
  });
}
