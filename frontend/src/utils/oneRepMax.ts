export type FormulaType = 'EPLEY' | 'BRZYCKI';

export interface OneRepMaxResult {
  oneRepMax: number;
  weight: number;
  reps: number;
  formula: FormulaType;
}

export interface PercentageRow {
  pct: number;
  reps: string;
  rpe: string;
  weight: number;
}

/**
 * Calculates 1 Rep Max using the Epley formula:
 * 1RM = weight * (1 + reps / 30)
 * For 1 rep, exactly the lifted weight is returned.
 */
export function calculateEpley(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

/**
 * Calculates 1 Rep Max using the Brzycki formula:
 * 1RM = weight * (36 / (37 - reps))
 * For 1 rep, exactly the lifted weight is returned.
 * Caps at reps >= 37 to prevent division by zero or negative outputs.
 */
export function calculateBrzycki(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  if (reps >= 37) return 0;
  return Math.round(weight * (36 / (37 - reps)) * 10) / 10;
}

/**
 * Unified 1RM calculator supporting EPLEY and BRZYCKI formulas.
 */
export function calculateOneRepMax(
  weight: number,
  reps: number,
  formula: FormulaType = 'EPLEY'
): OneRepMaxResult {
  const oneRepMax = formula === 'BRZYCKI'
    ? calculateBrzycki(weight, reps)
    : calculateEpley(weight, reps);

  return {
    oneRepMax,
    weight,
    reps,
    formula
  };
}

export const PERCENTAGE_PRESETS = [
  { pct: 100, reps: '1 повтор', rpe: '10' },
  { pct: 95, reps: '2 повтора', rpe: '9.5' },
  { pct: 90, reps: '3-4 повтора', rpe: '9' },
  { pct: 85, reps: '5-6 повторов', rpe: '8.5' },
  { pct: 80, reps: '7-8 повторов', rpe: '8' },
  { pct: 75, reps: '9-10 повторов', rpe: '7.5' },
  { pct: 70, reps: '11-12 повторов', rpe: '7' },
  { pct: 65, reps: '13-15 повторов', rpe: '6.5' },
  { pct: 60, reps: '16-20 повторов', rpe: '6' },
];

/**
 * Generates intensity percentages table for training programming.
 */
export function calculatePercentageTable(oneRepMax: number): PercentageRow[] {
  return PERCENTAGE_PRESETS.map((preset) => ({
    ...preset,
    weight: Math.round(oneRepMax * (preset.pct / 100) * 10) / 10
  }));
}
