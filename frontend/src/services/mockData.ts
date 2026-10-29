import programsDbRaw from './programsDb.json';
import type {
  Exercise,
  TrainingProgram,
  ProgramWeekResponse,
  FoodProduct,
  DailyNutritionResponse
} from '../types';

export interface StoredProgramTemplate {
  weekNumber: number;
  dayNumber: number;
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  intensityPercentage: number;
  restSeconds: number;
}

export interface StoredProgram {
  id: string;
  name: string;
  description: string;
  durationWeeks: number;
  movementCategory: 'BENCH' | 'SQUAT' | 'DEADLIFT' | 'POWERLIFTING' | 'UNIVERSAL';
  templates: StoredProgramTemplate[];
}

export const ALL_STORED_PROGRAMS: StoredProgram[] = programsDbRaw as StoredProgram[];

export const MOCK_EXERCISES: Exercise[] = [
  { id: 'ex-squat', name: 'Приседания', muscleGroup: 'Ноги / Квадрицепсы' },
  { id: 'ex-bench', name: 'Жим лежа', muscleGroup: 'Грудь / Плечи / Трицепс' },
  { id: 'ex-deadlift', name: 'Становая тяга', muscleGroup: 'Спина / Задняя поверхность бедра' },
  { id: 'ex-ohp', name: 'Жим штанги стоя (Армейский)', muscleGroup: 'Плечи / Трицепс' },
  { id: 'ex-cgbp', name: 'Жим лёжа узким хватом', muscleGroup: 'Трицепс / Грудь' },
  { id: 'ex-row', name: 'Тяга штанги в наклоне', muscleGroup: 'Широчайшие / Трапеции' },
  { id: 'ex-pullup', name: 'Подтягивания с весом', muscleGroup: 'Широчайшие / Бицепс' },
  { id: 'ex-dips', name: 'Брусья с весом', muscleGroup: 'Грудные / Трицепс' },
  { id: 'ex-hyperext', name: 'Гиперэкстензия', muscleGroup: 'Разгибатели спины / Ягодицы' }
];

export const MOCK_PROGRAMS: TrainingProgram[] = ALL_STORED_PROGRAMS.map((p) => ({
  id: p.id,
  name: p.name,
  description: p.description,
  durationWeeks: p.durationWeeks,
  movementCategory: p.movementCategory
}));

export const MOCK_FOOD_PRODUCTS: FoodProduct[] = [
  { id: 'food-chicken', name: 'Куриное филе грудки', caloriesPer100g: 113, proteinPer100g: 23.6, fatPer100g: 1.9, carbsPer100g: 0.4 },
  { id: 'food-curd', name: 'Творог 5%', caloriesPer100g: 121, proteinPer100g: 16.0, fatPer100g: 5.0, carbsPer100g: 3.0 },
  { id: 'food-egg', name: 'Яйцо куриное (1 шт / 55г)', caloriesPer100g: 157, proteinPer100g: 12.7, fatPer100g: 11.5, carbsPer100g: 0.7 },
  { id: 'food-oats', name: 'Овсяные хлопья Геркулес', caloriesPer100g: 352, proteinPer100g: 12.3, fatPer100g: 6.2, carbsPer100g: 61.8 },
  { id: 'food-buckwheat', name: 'Гречневая крупа (ядрица)', caloriesPer100g: 308, proteinPer100g: 12.6, fatPer100g: 3.3, carbsPer100g: 57.1 },
  { id: 'food-banana', name: 'Банан свежий', caloriesPer100g: 95, proteinPer100g: 1.5, fatPer100g: 0.2, carbsPer100g: 21.8 }
];

export const MOCK_DAILY_NUTRITION: DailyNutritionResponse = {
  entries: [
    {
      id: 'mock-nut-1',
      productName: 'Овсяные хлопья Геркулес (каша)',
      weightGrams: 80,
      calories: 281,
      protein: 9.8,
      fat: 5.0,
      carbs: 49.4,
      mealType: 'Завтрак'
    },
    {
      id: 'mock-nut-2',
      productName: 'Куриное филе грудки запеченное',
      weightGrams: 200,
      calories: 226,
      protein: 47.2,
      fat: 3.8,
      carbs: 0.8,
      mealType: 'Обед'
    },
    {
      id: 'mock-nut-3',
      productName: 'Творог 5% с бананом',
      weightGrams: 250,
      calories: 302,
      protein: 40.0,
      fat: 12.5,
      carbs: 7.5,
      mealType: 'Ужин'
    }
  ],
  totalCalories: 809,
  totalProtein: 97.0,
  totalFat: 21.3,
  totalCarbs: 57.7
};

function roundToStep(val: number, step = 2.5): number {
  return Math.round(val / step) * step;
}

export function generateMockProgramWeek(
  programId: string,
  weekNumber: number,
  bench1Rm = 100,
  squat1Rm = 140,
  deadlift1Rm = 160
): ProgramWeekResponse[] {
  const b = bench1Rm || 100;
  const s = squat1Rm || 140;
  const d = deadlift1Rm || 160;

  // Find in our full database
  const found = ALL_STORED_PROGRAMS.find(
    (p) => p.id === programId || p.name.toLowerCase().includes(programId.toLowerCase())
  );

  if (found && found.templates && found.templates.length > 0) {
    const weekTemplates = found.templates.filter((t) => t.weekNumber === weekNumber);
    if (weekTemplates.length > 0) {
      return weekTemplates.map((t) => {
        let base1Rm = b;
        const lowerName = t.exerciseName.toLowerCase();
        if (lowerName.includes('присед') || lowerName.includes('squat')) {
          base1Rm = s;
        } else if (lowerName.includes('тяг') || lowerName.includes('deadlift')) {
          base1Rm = d;
        }

        const calculatedWeightKg = roundToStep(base1Rm * (t.intensityPercentage / 100));

        return {
          programId: found.id,
          programName: found.name,
          weekNumber: t.weekNumber,
          dayNumber: t.dayNumber,
          exerciseId: t.exerciseId,
          exerciseName: t.exerciseName,
          sets: t.sets,
          reps: t.reps,
          intensityPercentage: t.intensityPercentage,
          calculatedWeightKg,
          restSeconds: t.restSeconds || 120
        };
      });
    }
  }

  // Generic fallback if week out of range
  const baseIntensity = 75 + (weekNumber - 1) * 2;
  return [
    {
      programId,
      programName: found ? found.name : 'Силовая программа',
      weekNumber,
      dayNumber: 1,
      exerciseId: 'ex-squat',
      exerciseName: 'Приседания',
      sets: 4,
      reps: 5,
      intensityPercentage: baseIntensity,
      calculatedWeightKg: roundToStep(s * (baseIntensity / 100)),
      restSeconds: 180
    },
    {
      programId,
      programName: found ? found.name : 'Силовая программа',
      weekNumber,
      dayNumber: 2,
      exerciseId: 'ex-bench',
      exerciseName: 'Жим лежа',
      sets: 4,
      reps: 5,
      intensityPercentage: baseIntensity,
      calculatedWeightKg: roundToStep(b * (baseIntensity / 100)),
      restSeconds: 150
    },
    {
      programId,
      programName: found ? found.name : 'Силовая программа',
      weekNumber,
      dayNumber: 3,
      exerciseId: 'ex-deadlift',
      exerciseName: 'Становая тяга',
      sets: 4,
      reps: 4,
      intensityPercentage: baseIntensity,
      calculatedWeightKg: roundToStep(d * (baseIntensity / 100)),
      restSeconds: 210
    }
  ];
}
