export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  createdAt?: string;
}

export interface WorkoutSetRequest {
  exerciseId: string;
  weightKg: number;
  reps: number;
  rpe?: number;
  workoutDate?: string;
}

export interface WorkoutSetResponse {
  id: string;
  exerciseId: string;
  exerciseName: string;
  weightKg: number;
  reps: number;
  rpe?: number;
  workoutDate: string;
  estimatedOneRmEpley: number;
  estimatedOneRmBrzycki: number;
}

export interface WorkoutStatsResponse {
  exerciseId: string;
  exerciseName: string;
  maxWeight: number;
  maxWeightReps: number;
  maxOneRmEpley: number;
  maxOneRmBrzycki: number;
  totalSetsCount: number;
  totalVolume: number;
}

export interface OneRepMaxRequest {
  weight: number;
  reps: number;
  formula: 'EPLEY' | 'BRZYCKI';
}

export interface OneRepMaxResponse {
  oneRepMax: number;
  formulaUsed: string;
  weight: number;
  reps: number;
}

export interface FoodProduct {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbsPer100g: number;
}

export interface NutritionEntryRequest {
  foodProductId?: string;
  foodName?: string;
  weightGrams?: number;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  mealType?: string;
  entryDate?: string;
}

export interface NutritionEntryDto {
  id?: string;
  productName: string;
  weightGrams?: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  mealType?: string;
}

export interface DailyNutritionResponse {
  entries: NutritionEntryDto[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
}

export interface NutritionTarget {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  goalType?: 'DEFICIT' | 'MAINTENANCE' | 'SURPLUS';
  goalName?: string;
  updatedAt?: string;
}

export interface TrainingProgram {
  id: string;
  name: string;
  description: string;
  durationWeeks: number;
  movementCategory?: 'BENCH' | 'SQUAT' | 'DEADLIFT' | 'POWERLIFTING' | 'UNIVERSAL';
  createdAt?: string;
}

export interface ProgramWeekResponse {
  programId: string;
  programName: string;
  weekNumber: number;
  dayNumber: number;
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  intensityPercentage: number;
  calculatedWeightKg: number;
  restSeconds?: number;
}

export interface BaseExerciseItem {
  exerciseName: string;
  sets: number;
  reps: number;
  intensityPercentage: number;
  calculatedWeightKg: number;
}

export interface AccessoryExerciseItem {
  id?: string;
  name: string;
  sets: number;
  reps: number;
  weightKg?: number;
  notes?: string;
}

export interface TrainingDiaryRequest {
  programId?: string;
  programName: string;
  weekNumber: number;
  dayNumber: number;
  workoutDate: string;
  baseExercises: string;
  accessoryExercises: string;
  notes?: string;
}

export interface TrainingDiaryResponse {
  id: string;
  programId?: string;
  programName: string;
  weekNumber: number;
  dayNumber: number;
  workoutDate: string;
  baseExercises: string;
  accessoryExercises: string;
  notes?: string;
  createdAt: string;
}
