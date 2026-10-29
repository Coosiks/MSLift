import axios from 'axios';
import {
  MOCK_EXERCISES,
  MOCK_PROGRAMS,
  MOCK_FOOD_PRODUCTS,
  MOCK_DAILY_NUTRITION,
  generateMockProgramWeek
} from './mockData';
import { storage } from './storage';
import type {
  Exercise,
  WorkoutSetRequest,
  WorkoutSetResponse,
  WorkoutStatsResponse,
  OneRepMaxRequest,
  OneRepMaxResponse,
  FoodProduct,
  NutritionEntryRequest,
  NutritionEntryDto,
  DailyNutritionResponse,
  TrainingProgram,
  ProgramWeekResponse,
  TrainingDiaryRequest,
  TrainingDiaryResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3500, // Короткий таймаут для быстрого перехода в оффлайн-режим в зале
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper for local diary in localStorage / Preferences
async function getLocalDiary(): Promise<TrainingDiaryResponse[]> {
  try {
    const raw = await storage.get('mslift_local_diary');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveLocalDiary(entries: TrainingDiaryResponse[]): Promise<void> {
  await storage.set('mslift_local_diary', JSON.stringify(entries));
}

// Helper for local sets
async function getLocalSets(): Promise<WorkoutSetResponse[]> {
  try {
    const raw = await storage.get('mslift_local_sets');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveLocalSets(sets: WorkoutSetResponse[]): Promise<void> {
  await storage.set('mslift_local_sets', JSON.stringify(sets));
}

export const api = {
  // --- 1RM Calculator ---
  calculate1RM: async (data: OneRepMaxRequest): Promise<OneRepMaxResponse> => {
    if (!storage.isOfflineMode()) {
      try {
        const res = await client.post<OneRepMaxResponse>('/calculator/1rm', data);
        return res.data;
      } catch (e) {
        // Fallback to local math
      }
    }
    // Local calculation
    const w = data.weight;
    const r = data.reps;
    let max = w;
    if (data.formula === 'BRZYCKI') {
      max = r === 1 ? w : Math.round(w * (36 / (37 - r)) * 10) / 10;
    } else {
      max = r === 1 ? w : Math.round(w * (1 + r / 30) * 10) / 10;
    }
    return {
      oneRepMax: max,
      formulaUsed: data.formula,
      weight: w,
      reps: r
    };
  },

  // --- Workouts & Exercises ---
  getExercises: async (): Promise<Exercise[]> => {
    if (!storage.isOfflineMode()) {
      try {
        const res = await client.get<Exercise[]>('/workouts/exercises');
        return res.data;
      } catch (e) {
        // Fallback
      }
    }
    return MOCK_EXERCISES;
  },

  addWorkoutSet: async (data: WorkoutSetRequest): Promise<WorkoutSetResponse> => {
    const exercise = MOCK_EXERCISES.find((e) => e.id === data.exerciseId);
    const exerciseName = exercise ? exercise.name : 'Упражнение';
    const epley = Math.round(data.weightKg * (1 + data.reps / 30) * 10) / 10;
    const brzycki = Math.round(data.weightKg * (36 / (37 - data.reps)) * 10) / 10;

    const localSet: WorkoutSetResponse = {
      id: Math.random().toString(36).substring(2, 9),
      exerciseId: data.exerciseId,
      exerciseName,
      weightKg: data.weightKg,
      reps: data.reps,
      rpe: data.rpe,
      workoutDate: data.workoutDate || new Date().toISOString(),
      estimatedOneRmEpley: epley,
      estimatedOneRmBrzycki: brzycki
    };

    // Save locally
    const sets = await getLocalSets();
    sets.unshift(localSet);
    await saveLocalSets(sets);

    if (!storage.isOfflineMode()) {
      try {
        const res = await client.post<WorkoutSetResponse>('/workouts/sets', data);
        return res.data;
      } catch (e) {
        // Handled by local fallback
      }
    }

    return localSet;
  },

  getWorkoutHistory: async (exerciseId: string): Promise<WorkoutSetResponse[]> => {
    if (!storage.isOfflineMode()) {
      try {
        const res = await client.get<WorkoutSetResponse[]>('/workouts/sets', {
          params: { exerciseId },
        });
        return res.data;
      } catch (e) {
        // Fallback
      }
    }
    const sets = await getLocalSets();
    return sets.filter((s) => s.exerciseId === exerciseId);
  },

  getExerciseStats: async (exerciseId: string): Promise<WorkoutStatsResponse> => {
    if (!storage.isOfflineMode()) {
      try {
        const res = await client.get<WorkoutStatsResponse>(`/workouts/stats/${exerciseId}`);
        return res.data;
      } catch (e) {
        // Fallback
      }
    }
    const sets = await getLocalSets();
    const exSets = sets.filter((s) => s.exerciseId === exerciseId);
    const maxWeight = exSets.length ? Math.max(...exSets.map((s) => s.weightKg)) : 0;
    const totalVolume = exSets.reduce((sum, s) => sum + s.weightKg * s.reps, 0);

    return {
      exerciseId,
      exerciseName: MOCK_EXERCISES.find((e) => e.id === exerciseId)?.name || 'Упражнение',
      maxWeight,
      maxWeightReps: 1,
      maxOneRmEpley: maxWeight,
      maxOneRmBrzycki: maxWeight,
      totalSetsCount: exSets.length,
      totalVolume
    };
  },

  // --- Nutrition ---
  getFoodProducts: async (): Promise<FoodProduct[]> => {
    if (!storage.isOfflineMode()) {
      try {
        const res = await client.get<FoodProduct[]>('/nutrition/products');
        return res.data;
      } catch (e) {
        // Fallback
      }
    }
    return MOCK_FOOD_PRODUCTS;
  },

  addNutritionEntry: async (data: NutritionEntryRequest): Promise<NutritionEntryDto> => {
    if (!storage.isOfflineMode()) {
      try {
        const res = await client.post<NutritionEntryDto>('/nutrition/entries', data);
        return res.data;
      } catch (e) {
        // Fallback
      }
    }
    return {
      id: Math.random().toString(36).substring(2, 9),
      productName: data.foodName || 'Продукт',
      weightGrams: data.weightGrams,
      calories: data.calories || 0,
      protein: data.protein || 0,
      fat: data.fat || 0,
      carbs: data.carbs || 0,
      mealType: data.mealType || 'Перекус'
    };
  },

  getDailyNutrition: async (date?: string): Promise<DailyNutritionResponse> => {
    if (!storage.isOfflineMode()) {
      try {
        const res = await client.get<DailyNutritionResponse>('/nutrition/daily', {
          params: date ? { date } : {},
        });
        return res.data;
      } catch (e) {
        // Fallback
      }
    }
    return MOCK_DAILY_NUTRITION;
  },

  deleteNutritionEntry: async (id: string): Promise<void> => {
    if (!storage.isOfflineMode()) {
      try {
        await client.delete(`/nutrition/entries/${id}`);
      } catch (e) {
        // Fallback
      }
    }
  },

  // --- Training Programs ---
  getPrograms: async (category?: string): Promise<TrainingProgram[]> => {
    if (!storage.isOfflineMode()) {
      try {
        const res = await client.get<TrainingProgram[]>('/programs', {
          params: category && category !== 'ALL' ? { category } : {},
        });
        if (res.data && res.data.length > 0) return res.data;
      } catch (e) {
        // Fallback
      }
    }
    return MOCK_PROGRAMS;
  },

  getProgramById: async (programId: string): Promise<TrainingProgram> => {
    if (!storage.isOfflineMode()) {
      try {
        const res = await client.get<TrainingProgram>(`/programs/${programId}`);
        return res.data;
      } catch (e) {
        // Fallback
      }
    }
    const found = MOCK_PROGRAMS.find((p) => p.id === programId);
    return found || MOCK_PROGRAMS[0];
  },

  getProgramWeek: async (
    programId: string,
    weekNumber: number,
    exerciseId?: string,
    customOneRm?: number,
    bench1Rm?: number,
    squat1Rm?: number,
    deadlift1Rm?: number
  ): Promise<ProgramWeekResponse[]> => {
    if (!storage.isOfflineMode()) {
      try {
        const params: Record<string, string | number> = {};
        if (exerciseId) params.exerciseId = exerciseId;
        if (customOneRm) params.customOneRm = customOneRm;
        if (bench1Rm) params.bench1Rm = bench1Rm;
        if (squat1Rm) params.squat1Rm = squat1Rm;
        if (deadlift1Rm) params.deadlift1Rm = deadlift1Rm;

        const res = await client.get<ProgramWeekResponse[]>(
          `/programs/${programId}/week/${weekNumber}`,
          { params }
        );
        if (res.data && res.data.length > 0) return res.data;
      } catch (e) {
        // Fallback
      }
    }
    return generateMockProgramWeek(programId, weekNumber, bench1Rm, squat1Rm, deadlift1Rm);
  },

  getFullProgram: async (
    programId: string,
    exerciseId?: string,
    customOneRm?: number,
    bench1Rm?: number,
    squat1Rm?: number,
    deadlift1Rm?: number
  ): Promise<ProgramWeekResponse[]> => {
    if (!storage.isOfflineMode()) {
      try {
        const params: Record<string, string | number> = {};
        if (exerciseId) params.exerciseId = exerciseId;
        if (customOneRm) params.customOneRm = customOneRm;
        if (bench1Rm) params.bench1Rm = bench1Rm;
        if (squat1Rm) params.squat1Rm = squat1Rm;
        if (deadlift1Rm) params.deadlift1Rm = deadlift1Rm;

        const res = await client.get<ProgramWeekResponse[]>(`/programs/${programId}/full`, {
          params,
        });
        if (res.data && res.data.length > 0) return res.data;
      } catch (e) {
        // Fallback
      }
    }
    return generateMockProgramWeek(programId, 1, bench1Rm, squat1Rm, deadlift1Rm);
  },

  // --- Training Diary with Program & Accessories ---
  addDiaryEntry: async (data: TrainingDiaryRequest): Promise<TrainingDiaryResponse> => {
    const localEntry: TrainingDiaryResponse = {
      id: Math.random().toString(36).substring(2, 9),
      programId: data.programId,
      programName: data.programName,
      weekNumber: data.weekNumber,
      dayNumber: data.dayNumber,
      workoutDate: data.workoutDate,
      baseExercises: data.baseExercises,
      accessoryExercises: data.accessoryExercises,
      notes: data.notes,
      createdAt: new Date().toISOString()
    };

    // Always persist to local diary first
    const diary = await getLocalDiary();
    diary.unshift(localEntry);
    await saveLocalDiary(diary);

    if (!storage.isOfflineMode()) {
      try {
        const res = await client.post<TrainingDiaryResponse>('/workouts/diary', data);
        return res.data;
      } catch (e) {
        // Handled by local fallback
      }
    }

    return localEntry;
  },

  getDiaryEntries: async (): Promise<TrainingDiaryResponse[]> => {
    const localEntries = await getLocalDiary();
    if (!storage.isOfflineMode()) {
      try {
        const res = await client.get<TrainingDiaryResponse[]>('/workouts/diary');
        if (res.data && res.data.length > 0) {
          // Merge server entries with any unsaved local entries
          const serverIds = new Set(res.data.map((d) => d.id));
          const uniqueLocals = localEntries.filter((l) => !serverIds.has(l.id));
          return [...uniqueLocals, ...res.data];
        }
      } catch (e) {
        // Fallback
      }
    }
    return localEntries;
  },

  deleteDiaryEntry: async (id: string): Promise<void> => {
    const diary = await getLocalDiary();
    const filtered = diary.filter((d) => d.id !== id);
    await saveLocalDiary(filtered);

    if (!storage.isOfflineMode()) {
      try {
        await client.delete(`/workouts/diary/${id}`);
      } catch (e) {
        // Fallback
      }
    }
  },
};
