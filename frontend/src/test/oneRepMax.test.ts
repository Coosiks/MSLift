import { describe, it, expect } from 'vitest';
import {
  calculateEpley,
  calculateBrzycki,
  calculateOneRepMax,
  calculatePercentageTable,
  PERCENTAGE_PRESETS
} from '../utils/oneRepMax';

describe('1RM Calculator - Epley Formula', () => {
  it('should return exact weight for 1 repetition', () => {
    expect(calculateEpley(100, 1)).toBe(100);
    expect(calculateEpley(225.5, 1)).toBe(225.5);
  });

  it('should accurately calculate 1RM for standard reps using Epley formula', () => {
    // 100 * (1 + 5 / 30) = 100 * 1.16666... = 116.7
    expect(calculateEpley(100, 5)).toBe(116.7);

    // 140 * (1 + 10 / 30) = 140 * 1.33333... = 186.7
    expect(calculateEpley(140, 10)).toBe(186.7);

    // 60 * (1 + 8 / 30) = 60 * 1.26666... = 76.0
    expect(calculateEpley(60, 8)).toBe(76);
  });

  it('should return 0 for non-positive weight or reps', () => {
    expect(calculateEpley(0, 5)).toBe(0);
    expect(calculateEpley(-100, 5)).toBe(0);
    expect(calculateEpley(100, 0)).toBe(0);
    expect(calculateEpley(100, -2)).toBe(0);
  });
});

describe('1RM Calculator - Brzycki Formula', () => {
  it('should return exact weight for 1 repetition', () => {
    expect(calculateBrzycki(100, 1)).toBe(100);
    expect(calculateBrzycki(180, 1)).toBe(180);
  });

  it('should accurately calculate 1RM for standard reps using Brzycki formula', () => {
    // 100 * (36 / (37 - 5)) = 100 * (36 / 32) = 100 * 1.125 = 112.5
    expect(calculateBrzycki(100, 5)).toBe(112.5);

    // 140 * (36 / (37 - 10)) = 140 * (36 / 27) = 140 * 1.3333... = 186.7
    expect(calculateBrzycki(140, 10)).toBe(186.7);

    // 80 * (36 / (37 - 4)) = 80 * (36 / 33) = 87.3
    expect(calculateBrzycki(80, 4)).toBe(87.3);
  });

  it('should handle reps >= 37 safely without division by zero or negative results', () => {
    expect(calculateBrzycki(100, 37)).toBe(0);
    expect(calculateBrzycki(100, 40)).toBe(0);
  });

  it('should return 0 for non-positive inputs', () => {
    expect(calculateBrzycki(0, 5)).toBe(0);
    expect(calculateBrzycki(100, 0)).toBe(0);
  });
});

describe('Unified calculateOneRepMax', () => {
  it('should default to EPLEY formula when not specified', () => {
    const result = calculateOneRepMax(100, 5);
    expect(result.formula).toBe('EPLEY');
    expect(result.oneRepMax).toBe(116.7);
    expect(result.weight).toBe(100);
    expect(result.reps).toBe(5);
  });

  it('should calculate with BRZYCKI when requested', () => {
    const result = calculateOneRepMax(100, 5, 'BRZYCKI');
    expect(result.formula).toBe('BRZYCKI');
    expect(result.oneRepMax).toBe(112.5);
  });
});

describe('Percentage Table Generator', () => {
  it('should generate correct weights for each percentage tier', () => {
    const table = calculatePercentageTable(100);
    expect(table).toHaveLength(PERCENTAGE_PRESETS.length);

    const p100 = table.find((r) => r.pct === 100);
    expect(p100?.weight).toBe(100);
    expect(p100?.rpe).toBe('10');

    const p90 = table.find((r) => r.pct === 90);
    expect(p90?.weight).toBe(90);

    const p75 = table.find((r) => r.pct === 75);
    expect(p75?.weight).toBe(75);

    const p60 = table.find((r) => r.pct === 60);
    expect(p60?.weight).toBe(60);
  });

  it('should accurately round fractional weights to one decimal', () => {
    const table = calculatePercentageTable(182.5);
    const p90 = table.find((r) => r.pct === 90);
    // 182.5 * 0.90 = 164.25 -> 164.3
    expect(p90?.weight).toBe(164.3);
  });
});
