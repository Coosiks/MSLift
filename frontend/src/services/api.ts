import axios from 'axios';
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

const API_BASE_URL = 'http://localhost:8080/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // --- 1RM Calculator ---
  calculate1RM: async (data: OneRepMaxRequest): Promise<OneRepMaxResponse> => {
    const res = await client.post<OneRepMaxResponse>('/calculator/1rm', data);
    return res.data;
  },

  // --- Workouts & Exercises ---
  getExercises: async (): Promise<Exercise[]> => {
    const res = await client.get<Exercise[]>('/workouts/exercises');
    return res.data;
  },

  addWorkoutSet: async (data: WorkoutSetRequest): Promise<WorkoutSetResponse> => {
    const res = await client.post<WorkoutSetResponse>('/workouts/sets', data);
    return res.data;
  },

  getWorkoutHistory: async (exerciseId: string): Promise<WorkoutSetResponse[]> => {
    const res = await client.get<WorkoutSetResponse[]>('/workouts/sets', {
      params: { exerciseId },
    });
    return res.data;
  },

  getExerciseStats: async (exerciseId: string): Promise<WorkoutStatsResponse> => {
    const res = await client.get<WorkoutStatsResponse>(`/workouts/stats/${exerciseId}`);
    return res.data;
  },

  // --- Nutrition ---
  getFoodProducts: async (): Promise<FoodProduct[]> => {
    const res = await client.get<FoodProduct[]>('/nutrition/products');
    return res.data;
  },

  addNutritionEntry: async (data: NutritionEntryRequest): Promise<NutritionEntryDto> => {
    const res = await client.post<NutritionEntryDto>('/nutrition/entries', data);
    return res.data;
  },

  getDailyNutrition: async (date?: string): Promise<DailyNutritionResponse> => {
    const res = await client.get<DailyNutritionResponse>('/nutrition/daily', {
      params: date ? { date } : {},
    });
    return res.data;
  },

  deleteNutritionEntry: async (id: string): Promise<void> => {
    await client.delete(`/nutrition/entries/${id}`);
  },

  // --- Training Programs ---
  getPrograms: async (category?: string): Promise<TrainingProgram[]> => {
    const res = await client.get<TrainingProgram[]>('/programs', {
      params: category && category !== 'ALL' ? { category } : {},
    });
    return res.data;
  },

  getProgramById: async (programId: string): Promise<TrainingProgram> => {
    const res = await client.get<TrainingProgram>(`/programs/${programId}`);
    return res.data;
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
    return res.data;
  },

  getFullProgram: async (
    programId: string,
    exerciseId?: string,
    customOneRm?: number,
    bench1Rm?: number,
    squat1Rm?: number,
    deadlift1Rm?: number
  ): Promise<ProgramWeekResponse[]> => {
    const params: Record<string, string | number> = {};
    if (exerciseId) params.exerciseId = exerciseId;
    if (customOneRm) params.customOneRm = customOneRm;
    if (bench1Rm) params.bench1Rm = bench1Rm;
    if (squat1Rm) params.squat1Rm = squat1Rm;
    if (deadlift1Rm) params.deadlift1Rm = deadlift1Rm;

    const res = await client.get<ProgramWeekResponse[]>(`/programs/${programId}/full`, {
      params,
    });
    return res.data;
  },

  // --- Training Diary with Program & Accessories ---
  addDiaryEntry: async (data: TrainingDiaryRequest): Promise<TrainingDiaryResponse> => {
    const res = await client.post<TrainingDiaryResponse>('/workouts/diary', data);
    return res.data;
  },

  getDiaryEntries: async (): Promise<TrainingDiaryResponse[]> => {
    const res = await client.get<TrainingDiaryResponse[]>('/workouts/diary');
    return res.data;
  },

  deleteDiaryEntry: async (id: string): Promise<void> => {
    await client.delete(`/workouts/diary/${id}`);
  },
};
