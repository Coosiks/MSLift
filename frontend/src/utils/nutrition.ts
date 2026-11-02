export interface ActivityOption {
  level: number;
  multiplier: number;
  title: string;
  description: string;
}

export const ACTIVITY_OPTIONS: ActivityOption[] = [
  {
    level: 1,
    multiplier: 1.2,
    title: 'Сидячий образ жизни',
    description: 'Минимум движения, сидячая работа, без тренировок'
  },
  {
    level: 2,
    multiplier: 1.375,
    title: 'Лёгкая активность',
    description: '1–3 лёгкие тренировки в неделю, умеренная бытовая активность'
  },
  {
    level: 3,
    multiplier: 1.55,
    title: 'Средняя активность',
    description: '3–5 силовых тренировок в неделю (стандарт пауэрлифтера)'
  },
  {
    level: 4,
    multiplier: 1.725,
    title: 'Высокая активность',
    description: '5–6 тяжёлых силовых тренировок или физ. работа'
  },
  {
    level: 5,
    multiplier: 1.9,
    title: 'Экстремальная активность',
    description: '2 тренировки в день / тяжёлая подготовка к соревнованиям'
  }
];

export interface BmrParams {
  gender: 'male' | 'female';
  weight: number;
  height: number;
  age: number;
}

/**
 * Mifflin - St Jeor formula for Basal Metabolic Rate (BMR)
 * Male: 10 * weight + 6.25 * height - 5 * age + 5
 * Female: 10 * weight + 6.25 * height - 5 * age - 161
 */
export function calculateBmrMifflinStJeor(params: BmrParams): number {
  const { gender, weight, height, age } = params;
  if (weight <= 0 || height <= 0 || age <= 0) return 0;

  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

/**
 * Katch - McArdle formula for BMR based on Lean Body Mass (LBM)
 * LBM = weight * (100 - bodyFatPercent) / 100
 * BMR = 370 + 21.6 * LBM
 */
export function calculateBmrKatchMcArdle(
  weight: number,
  bodyFatPercent: number
): { bmr: number; leanBodyMass: number } {
  if (weight <= 0 || bodyFatPercent <= 0 || bodyFatPercent >= 100) {
    return { bmr: 0, leanBodyMass: 0 };
  }
  const leanBodyMass = Math.round((weight * (100 - bodyFatPercent)) / 100 * 10) / 10;
  const bmr = Math.round((370 + 21.6 * leanBodyMass) * 10) / 10;
  return { bmr, leanBodyMass };
}

/**
 * Total Daily Energy Expenditure (TDEE)
 */
export function calculateTdee(bmr: number, multiplier: number): number {
  if (bmr <= 0 || multiplier <= 0) return 0;
  return Math.round(bmr * multiplier);
}

export type NutritionPlanType = 'DEFICIT' | 'MAINTENANCE' | 'SURPLUS';

export interface MacroPlan {
  type: NutritionPlanType;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

/**
 * Calculates macro distribution (KBJU) for powerlifting / strength training goals:
 * - DEFICIT (-15% kcal, 2.2g/kg protein, 0.9g/kg fat, remainder carbs)
 * - MAINTENANCE (100% kcal, 1.8g/kg protein, 1.0g/kg fat, remainder carbs)
 * - SURPLUS (+15% kcal, 2.0g/kg protein, 1.0g/kg fat, remainder carbs)
 */
export function calculateMacroTargets(
  weight: number,
  tdee: number,
  planType: NutritionPlanType
): MacroPlan {
  let calories = 0;
  let proteinRate = 0;
  let fatRate = 0;

  switch (planType) {
    case 'DEFICIT':
      calories = Math.round(tdee * 0.85);
      proteinRate = 2.2;
      fatRate = 0.9;
      break;
    case 'MAINTENANCE':
      calories = tdee;
      proteinRate = 1.8;
      fatRate = 1.0;
      break;
    case 'SURPLUS':
      calories = Math.round(tdee * 1.15);
      proteinRate = 2.0;
      fatRate = 1.0;
      break;
  }

  const protein = Math.round(proteinRate * weight);
  const fat = Math.round(fatRate * weight);
  const proteinKcal = protein * 4;
  const fatKcal = fat * 9;
  const carbs = Math.max(0, Math.round((calories - (proteinKcal + fatKcal)) / 4));

  return {
    type: planType,
    calories,
    protein,
    fat,
    carbs
  };
}

/**
 * Calculates all 3 target plans at once for a given weight and TDEE.
 */
export function calculateAllMacroPlans(
  weight: number,
  tdee: number
): Record<NutritionPlanType, MacroPlan> {
  return {
    DEFICIT: calculateMacroTargets(weight, tdee, 'DEFICIT'),
    MAINTENANCE: calculateMacroTargets(weight, tdee, 'MAINTENANCE'),
    SURPLUS: calculateMacroTargets(weight, tdee, 'SURPLUS')
  };
}

export interface NutritionValues {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

/**
 * Calculates nutritional values for a custom portion size given values per 100g.
 */
export function calculatePortionMacros(
  per100g: NutritionValues,
  grams: number
): NutritionValues {
  if (grams <= 0) {
    return { calories: 0, protein: 0, fat: 0, carbs: 0 };
  }
  const ratio = grams / 100;
  return {
    calories: Math.round(per100g.calories * ratio),
    protein: Math.round(per100g.protein * ratio * 10) / 10,
    fat: Math.round(per100g.fat * ratio * 10) / 10,
    carbs: Math.round(per100g.carbs * ratio * 10) / 10
  };
}
