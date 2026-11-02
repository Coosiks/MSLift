import { describe, it, expect } from 'vitest';
import {
  calculateBmrMifflinStJeor,
  calculateBmrKatchMcArdle,
  calculateTdee,
  calculateMacroTargets,
  calculateAllMacroPlans,
  calculatePortionMacros,
  ACTIVITY_OPTIONS
} from '../utils/nutrition';

describe('BMR Calculator - Mifflin - St Jeor Formula', () => {
  it('should calculate BMR accurately for males', () => {
    // Male: 10 * 82 + 6.25 * 180 - 5 * 25 + 5 = 820 + 1125 - 125 + 5 = 1825
    const bmr = calculateBmrMifflinStJeor({
      gender: 'male',
      weight: 82,
      height: 180,
      age: 25
    });
    expect(bmr).toBe(1825);
  });

  it('should calculate BMR accurately for females', () => {
    // Female: 10 * 60 + 6.25 * 165 - 5 * 28 - 161 = 600 + 1031.25 - 140 - 161 = 1330.25
    const bmr = calculateBmrMifflinStJeor({
      gender: 'female',
      weight: 60,
      height: 165,
      age: 28
    });
    expect(bmr).toBe(1330.25);
  });

  it('should return 0 when params are invalid or non-positive', () => {
    expect(
      calculateBmrMifflinStJeor({ gender: 'male', weight: 0, height: 180, age: 25 })
    ).toBe(0);
    expect(
      calculateBmrMifflinStJeor({ gender: 'female', weight: 60, height: -165, age: 28 })
    ).toBe(0);
  });
});

describe('BMR Calculator - Katch - McArdle Formula', () => {
  it('should calculate BMR and lean body mass from body fat percentage', () => {
    // 80kg, 15% fat -> LBM = 80 * 0.85 = 68.0 kg
    // BMR = 370 + 21.6 * 68 = 370 + 1468.8 = 1838.8
    const { bmr, leanBodyMass } = calculateBmrKatchMcArdle(80, 15);
    expect(leanBodyMass).toBe(68.0);
    expect(bmr).toBe(1838.8);
  });

  it('should return zeros for unrealistic body fat percentages', () => {
    expect(calculateBmrKatchMcArdle(80, 0)).toEqual({ bmr: 0, leanBodyMass: 0 });
    expect(calculateBmrKatchMcArdle(80, 105)).toEqual({ bmr: 0, leanBodyMass: 0 });
  });
});

describe('TDEE Calculator', () => {
  it('should apply activity multiplier correctly', () => {
    // 1825 * 1.55 (moderate powerlifter) = 2828.75 -> 2829
    const tdee = calculateTdee(1825, 1.55);
    expect(tdee).toBe(2829);
  });

  it('should support all standard activity levels', () => {
    const bmr = 2000;
    const multipliers = ACTIVITY_OPTIONS.map((a) => a.multiplier);
    expect(multipliers).toEqual([1.2, 1.375, 1.55, 1.725, 1.9]);

    expect(calculateTdee(bmr, 1.2)).toBe(2400);
    expect(calculateTdee(bmr, 1.9)).toBe(3800);
  });
});

describe('Macro Targets (КБЖУ) Calculations', () => {
  const weight = 80;
  const tdee = 2800;

  it('should calculate DEFICIT target (-15% kcal, 2.2g/kg protein, 0.9g/kg fat)', () => {
    const plan = calculateMacroTargets(weight, tdee, 'DEFICIT');

    // Calories: 2800 * 0.85 = 2380
    expect(plan.calories).toBe(2380);
    // Protein: 2.2 * 80 = 176g
    expect(plan.protein).toBe(176);
    // Fat: 0.9 * 80 = 72g
    expect(plan.fat).toBe(72);
    // Carbs: (2380 - (176*4 + 72*9)) / 4 = (2380 - 1352) / 4 = 1028 / 4 = 257g
    expect(plan.carbs).toBe(257);
  });

  it('should calculate MAINTENANCE target (100% kcal, 1.8g/kg protein, 1.0g/kg fat)', () => {
    const plan = calculateMacroTargets(weight, tdee, 'MAINTENANCE');

    // Calories: 2800
    expect(plan.calories).toBe(2800);
    // Protein: 1.8 * 80 = 144g
    expect(plan.protein).toBe(144);
    // Fat: 1.0 * 80 = 80g
    expect(plan.fat).toBe(80);
    // Carbs: (2800 - (144*4 + 80*9)) / 4 = (2800 - 1296) / 4 = 1504 / 4 = 376g
    expect(plan.carbs).toBe(376);
  });

  it('should calculate SURPLUS target (+15% kcal, 2.0g/kg protein, 1.0g/kg fat)', () => {
    const plan = calculateMacroTargets(weight, tdee, 'SURPLUS');

    // Calories: 2800 * 1.15 = 3220
    expect(plan.calories).toBe(3220);
    // Protein: 2.0 * 80 = 160g
    expect(plan.protein).toBe(160);
    // Fat: 1.0 * 80 = 80g
    expect(plan.fat).toBe(80);
    // Carbs: (3220 - (160*4 + 80*9)) / 4 = (3220 - 1360) / 4 = 1860 / 4 = 465g
    expect(plan.carbs).toBe(465);
  });

  it('should compute all three macro plans simultaneously', () => {
    const plans = calculateAllMacroPlans(weight, tdee);
    expect(plans.DEFICIT.calories).toBe(2380);
    expect(plans.MAINTENANCE.calories).toBe(2800);
    expect(plans.SURPLUS.calories).toBe(3220);
  });
});

describe('Portion Macro Scaler', () => {
  it('should correctly scale 100g food nutritional profile to specific portion', () => {
    const chickenBreast100g = {
      calories: 165,
      protein: 31,
      fat: 3.6,
      carbs: 0
    };

    // 250g serving
    const portion = calculatePortionMacros(chickenBreast100g, 250);
    expect(portion.calories).toBe(413); // 165 * 2.5 = 412.5 -> 413
    expect(portion.protein).toBe(77.5); // 31 * 2.5 = 77.5
    expect(portion.fat).toBe(9); // 3.6 * 2.5 = 9.0
    expect(portion.carbs).toBe(0);
  });

  it('should return 0 when portion weight is 0 or negative', () => {
    const values = { calories: 200, protein: 10, fat: 5, carbs: 20 };
    expect(calculatePortionMacros(values, 0)).toEqual({
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0
    });
  });
});
