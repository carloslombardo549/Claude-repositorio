// PRNG determinista (mulberry32). Los datos simulados se generan en tiempo de
// import y se renderizan en servidor y cliente por igual: usar Math.random()
// aquí produciría desajustes de hidratación y datos distintos en cada carga.

export function mulberry32(seed: number) {
  let a = seed;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Rng {
  private next: () => number;

  constructor(seed: number) {
    this.next = mulberry32(seed);
  }

  float(): number {
    return this.next();
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(items: readonly T[]): T {
    const item = items[this.int(0, items.length - 1)];
    if (item === undefined) {
      throw new Error("Rng.pick: lista vacía");
    }
    return item;
  }

  pickMany<T>(items: readonly T[], count: number): T[] {
    const pool = [...items];
    const result: T[] = [];
    for (let i = 0; i < count && pool.length > 0; i++) {
      const idx = this.int(0, pool.length - 1);
      result.push(pool.splice(idx, 1)[0] as T);
    }
    return result;
  }

  bool(probabilityTrue = 0.5): boolean {
    return this.next() < probabilityTrue;
  }

  daysAgo(maxDays: number, minDays = 0): Date {
    const days = this.int(minDays, maxDays);
    const date = new Date(BASE_NOW);
    date.setDate(date.getDate() - days);
    return date;
  }
}

// Fecha ancla fija para que "hoy" sea determinista en todos los datos
// simulados, en vez de depender del reloj real en cada carga.
export const BASE_NOW = new Date("2026-07-23T09:00:00Z");
