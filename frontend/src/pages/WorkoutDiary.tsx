import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Dumbbell,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Layers,
  Info,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';
import { hardware } from '../services/hardware';
import type {
  TrainingProgram,
  ProgramWeekResponse,
  BaseExerciseItem,
  AccessoryExerciseItem,
  TrainingDiaryResponse
} from '../types';

// Popular powerlifting accessory exercise recommendations
const POPULAR_ACCESSORIES = [
  'Жим гантелей лёжа',
  'Брусья с весом',
  'Французский жим',
  'Подтягивания',
  'Тяга гантели в наклоне',
  'Гиперэкстензия',
  'Жим штанги стоя',
  'Махи гантелями',
  'Подъём на бицепс',
  'Выпады с гантелями',
  'Жим лёжа узким хватом',
  'Планка с блином'
];

// Popular base exercises for free workout builder
const POPULAR_BASE_EXERCISES = [
  'Приседания со штангой',
  'Жим штанги лёжа',
  'Становая тяга',
  'Жим штанги стоя (Армейский)',
  'Жим лёжа узким хватом',
  'Тяга штанги в наклоне',
  'Фронтальные приседания',
  'Подтягивания с весом',
  'Брусья с весом'
];

const CUSTOM_FREE_PROGRAM: TrainingProgram = {
  id: 'custom-free-workout',
  name: 'Свободная тренировка (Свой план / Без программы)',
  description: 'Индивидуальная тренировка без шаблона. Вносите любые базовые и подсобные упражнения, подходы, повторения и веса вручную.',
  durationWeeks: 52,
  movementCategory: 'UNIVERSAL'
};

export const WorkoutDiary: React.FC = () => {
  // Programs & Selection
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('custom-free-workout');
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [workoutDate, setWorkoutDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('');

  // 1RM weights for base exercise calculations
  const [bench1Rm, setBench1Rm] = useState<number>(100);
  const [squat1Rm, setSquat1Rm] = useState<number>(140);
  const [deadlift1Rm, setDeadlift1Rm] = useState<number>(160);
  const [custom1Rm, setCustom1Rm] = useState<number>(100);

  // Program Base Exercises for selected week & day
  const [baseTemplates, setBaseTemplates] = useState<ProgramWeekResponse[]>([]);
  const [customBaseWeights, setCustomBaseWeights] = useState<Record<number, number>>({});
  const [loadingBase, setLoadingBase] = useState<boolean>(false);

  // Custom Base Exercises for Free Workout ("Свободная тренировка")
  const [customBaseList, setCustomBaseList] = useState<BaseExerciseItem[]>(() => {
    try {
      const saved = localStorage.getItem('mslift_diary_custom_base');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [customBaseName, setCustomBaseName] = useState<string>('');
  const [customBaseSets, setCustomBaseSets] = useState<number>(4);
  const [customBaseReps, setCustomBaseReps] = useState<number>(6);
  const [customBaseWeight, setCustomBaseWeight] = useState<string>('100');
  const [customCompletedSets, setCustomCompletedSets] = useState<Record<number, boolean>>({});

  // Accessory Exercises for current workout
  const [accessories, setAccessories] = useState<AccessoryExerciseItem[]>([]);
  const [accName, setAccName] = useState<string>('');
  const [accSets, setAccSets] = useState<number>(3);
  const [accReps, setAccReps] = useState<number>(10);
  const [accWeight, setAccWeight] = useState<string>('');
  const [accNotes, setAccNotes] = useState<string>('');

  // Completed Diary History
  const [diaryHistory, setDiaryHistory] = useState<TrainingDiaryResponse[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [savingWorkout, setSavingWorkout] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [completedSets, setCompletedSets] = useState<Record<number, boolean>>({});

  // Keep screen awake during workout session
  useEffect(() => {
    hardware.setKeepAwake(true);
    return () => {
      hardware.setKeepAwake(false);
    };
  }, []);

  const toggleCompleteSet = (idx: number, item: ProgramWeekResponse) => {
    const nextVal = !completedSets[idx];
    setCompletedSets((prev) => ({ ...prev, [idx]: nextVal }));
    if (nextVal) {
      hardware.haptic('success');
      hardware.scheduleRestTimer(item.restSeconds || 120, item.exerciseName);
    } else {
      hardware.haptic('light');
    }
  };

  const toggleCompleteCustomSet = (idx: number, item: BaseExerciseItem) => {
    const nextVal = !customCompletedSets[idx];
    setCustomCompletedSets((prev) => ({ ...prev, [idx]: nextVal }));
    if (nextVal) {
      hardware.haptic('success');
      hardware.scheduleRestTimer(120, item.exerciseName);
    } else {
      hardware.haptic('light');
    }
  };

  const handleAddCustomBase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBaseName.trim()) return;

    const newItem: BaseExerciseItem = {
      exerciseName: customBaseName.trim(),
      sets: Number(customBaseSets) || 3,
      reps: Number(customBaseReps) || 6,
      intensityPercentage: 100,
      calculatedWeightKg: Number(customBaseWeight) || 0
    };

    const updated = [...customBaseList, newItem];
    setCustomBaseList(updated);
    localStorage.setItem('mslift_diary_custom_base', JSON.stringify(updated));
    setCustomBaseName('');
    hardware.haptic('success');
  };

  const handleRemoveCustomBase = (idxToRemove: number) => {
    const updated = customBaseList.filter((_, idx) => idx !== idxToRemove);
    setCustomBaseList(updated);
    localStorage.setItem('mslift_diary_custom_base', JSON.stringify(updated));
    hardware.haptic('light');
  };

  const handleUpdateCustomBaseWeight = (idx: number, newWeight: number) => {
    const updated = customBaseList.map((item, i) =>
      i === idx ? { ...item, calculatedWeightKg: newWeight } : item
    );
    setCustomBaseList(updated);
    localStorage.setItem('mslift_diary_custom_base', JSON.stringify(updated));
  };

  // Load programs, cached state, and diary history on mount
  useEffect(() => {
    loadPrograms();
    loadDiaryHistory();

    // Restore saved active program and 1RMs from localStorage
    const savedProgId = localStorage.getItem('mslift_diary_prog_id');
    const savedWeek = localStorage.getItem('mslift_diary_week');
    const savedDay = localStorage.getItem('mslift_diary_day');
    const savedBench = localStorage.getItem('mslift_1rm_bench');
    const savedSquat = localStorage.getItem('mslift_1rm_squat');
    const savedDeadlift = localStorage.getItem('mslift_1rm_deadlift');
    const savedSingle = localStorage.getItem('mslift_1rm_single');

    if (savedProgId) setSelectedProgramId(savedProgId);
    if (savedWeek) setSelectedWeek(Number(savedWeek));
    if (savedDay) setSelectedDay(Number(savedDay));
    if (savedBench) setBench1Rm(Number(savedBench));
    if (savedSquat) setSquat1Rm(Number(savedSquat));
    if (savedDeadlift) setDeadlift1Rm(Number(savedDeadlift));
    if (savedSingle) setCustom1Rm(Number(savedSingle));
  }, []);

  // When selected program, week, or day changes, fetch base exercises
  useEffect(() => {
    if (selectedProgramId) {
      loadDayWorkout(selectedProgramId, selectedWeek, selectedDay);
      localStorage.setItem('mslift_diary_prog_id', selectedProgramId);
      localStorage.setItem('mslift_diary_week', String(selectedWeek));
      localStorage.setItem('mslift_diary_day', String(selectedDay));
    }
  }, [selectedProgramId, selectedWeek, selectedDay, bench1Rm, squat1Rm, deadlift1Rm, custom1Rm]);

  const loadPrograms = async () => {
    try {
      const data = await api.getPrograms();
      const combined = [CUSTOM_FREE_PROGRAM, ...data.filter((p) => p.id !== CUSTOM_FREE_PROGRAM.id)];
      setPrograms(combined);
      if (combined.length > 0) {
        const savedProgId = localStorage.getItem('mslift_diary_prog_id');
        const defaultProg = savedProgId
          ? combined.find((p) => p.id === savedProgId) || combined[0]
          : combined[0];
        setSelectedProgramId(defaultProg.id);
      }
    } catch (err) {
      console.error('Ошибка загрузки программ:', err);
    }
  };

  const loadDiaryHistory = async () => {
    try {
      setLoadingHistory(true);
      const entries = await api.getDiaryEntries();
      setDiaryHistory(entries);
      localStorage.setItem('mslift_diary_cache', JSON.stringify(entries));
    } catch (err) {
      console.warn('Серверный дневник недоступен, загружаем локальный кэш:', err);
      const cached = localStorage.getItem('mslift_diary_cache');
      if (cached) {
        try {
          setDiaryHistory(JSON.parse(cached));
        } catch (e) {
          console.error(e);
        }
      }
    } finally {
      setLoadingHistory(false);
    }
  };

  const selectedProgram = programs.find((p) => p.id === selectedProgramId) || CUSTOM_FREE_PROGRAM;
  const isCustomWorkout = selectedProgramId === 'custom-free-workout';
  const isPowerlifting =
    selectedProgram?.movementCategory === 'POWERLIFTING' ||
    selectedProgram?.movementCategory === 'UNIVERSAL';

  const loadDayWorkout = async (
    progId: string,
    week: number,
    day: number,
    forceBench = bench1Rm,
    forceSquat = squat1Rm,
    forceDeadlift = deadlift1Rm,
    forceCustom = custom1Rm
  ) => {
    if (progId === 'custom-free-workout') {
      setBaseTemplates([]);
      setLoadingBase(false);
      return;
    }
    try {
      setLoadingBase(true);
      const prog = programs.find((p) => p.id === progId);
      const isPl = prog?.movementCategory === 'POWERLIFTING' || prog?.movementCategory === 'UNIVERSAL';

      let weekData: ProgramWeekResponse[];
      if (isPl) {
        weekData = await api.getProgramWeek(
          progId,
          week,
          undefined,
          undefined,
          forceBench,
          forceSquat,
          forceDeadlift
        );
      } else {
        weekData = await api.getProgramWeek(
          progId,
          week,
          undefined,
          forceCustom,
          forceBench,
          forceSquat,
          forceDeadlift
        );
      }

      // Filter templates belonging to the selected day
      const dayTemplates = weekData.filter((t) => t.dayNumber === day);
      setBaseTemplates(dayTemplates);

      // Pre-fill custom base weights with newly calculated weights
      const initialWeights: Record<number, number> = {};
      dayTemplates.forEach((t, i) => {
        initialWeights[i] = t.calculatedWeightKg;
      });
      setCustomBaseWeights(initialWeights);
    } catch (err) {
      console.error('Ошибка загрузки упражнений дня:', err);
    } finally {
      setLoadingBase(false);
    }
  };

  // Add accessory exercise to current day
  const handleAddAccessory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accName.trim()) return;

    const newItem: AccessoryExerciseItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: accName.trim(),
      sets: Number(accSets) || 3,
      reps: Number(accReps) || 10,
      weightKg: accWeight ? Number(accWeight) : undefined,
      notes: accNotes.trim() || undefined
    };

    setAccessories((prev) => [...prev, newItem]);
    setAccName('');
    setAccWeight('');
    setAccNotes('');
  };

  // Remove accessory exercise
  const handleRemoveAccessory = (idToRemove?: string) => {
    setAccessories((prev) => prev.filter((a) => a.id !== idToRemove));
  };

  // Save complete workout session to diary
  const handleSaveWorkout = async () => {
    if (!selectedProgram) return;

    try {
      setSavingWorkout(true);
      setErrorMessage('');

      // Form base exercises payload
      let baseExercisesPayload: BaseExerciseItem[];
      if (selectedProgramId === 'custom-free-workout') {
        baseExercisesPayload = customBaseList;
      } else {
        baseExercisesPayload = baseTemplates.map((t, idx) => ({
          exerciseName: t.exerciseName,
          sets: t.sets,
          reps: t.reps,
          intensityPercentage: t.intensityPercentage,
          calculatedWeightKg: customBaseWeights[idx] !== undefined ? customBaseWeights[idx] : t.calculatedWeightKg
        }));
      }

      const requestPayload = {
        programId: selectedProgram.id,
        programName: selectedProgramId === 'custom-free-workout' ? 'Свободная тренировка (Свой план)' : selectedProgram.name,
        weekNumber: selectedWeek,
        dayNumber: selectedDay,
        workoutDate: workoutDate,
        baseExercises: JSON.stringify(baseExercisesPayload),
        accessoryExercises: JSON.stringify(accessories),
        notes: notes.trim() || undefined
      };

      let savedEntry: TrainingDiaryResponse;

      try {
        savedEntry = await api.addDiaryEntry(requestPayload);
      } catch (apiErr) {
        console.warn('API error, saving locally:', apiErr);
        // Fallback local creation if server offline
        savedEntry = {
          id: Math.random().toString(36).substring(2, 9),
          ...requestPayload,
          createdAt: new Date().toISOString()
        };
      }

      // Update state and local storage cache
      const updatedHistory = [savedEntry, ...diaryHistory];
      setDiaryHistory(updatedHistory);
      localStorage.setItem('mslift_diary_cache', JSON.stringify(updatedHistory));

      setSuccessMessage(
        `Тренировка успешно записана в дневник! (${selectedProgramId === 'custom-free-workout' ? 'Свободный план' : selectedProgram.name}, День ${selectedDay})`
      );
      setTimeout(() => setSuccessMessage(''), 5000);

      // Reset accessories, custom base, and notes for the next workout
      setAccessories([]);
      setNotes('');
      if (selectedProgramId === 'custom-free-workout') {
        setCustomBaseList([]);
        localStorage.removeItem('mslift_diary_custom_base');
        setCustomCompletedSets({});
        if (selectedDay < 7) {
          setSelectedDay((prev) => prev + 1);
        } else {
          setSelectedWeek((prev) => prev + 1);
          setSelectedDay(1);
        }
      } else {
        const maxDays = Math.max(...baseTemplates.map((t) => t.dayNumber), 3);
        if (selectedDay < maxDays) {
          setSelectedDay((prev) => prev + 1);
        } else if (selectedWeek < selectedProgram.durationWeeks) {
          setSelectedWeek((prev) => prev + 1);
          setSelectedDay(1);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Не удалось сохранить тренировку. Проверьте данные.');
    } finally {
      setSavingWorkout(false);
    }
  };

  // Delete diary history record
  const handleDeleteDiaryEntry = async (entryId: string) => {
    try {
      try {
        await api.deleteDiaryEntry(entryId);
      } catch (e) {
        console.warn('Server delete failed, deleting from local cache', e);
      }
      const updated = diaryHistory.filter((item) => item.id !== entryId);
      setDiaryHistory(updated);
      localStorage.setItem('mslift_diary_cache', JSON.stringify(updated));
    } catch (err) {
      console.error('Ошибка удаления записи:', err);
    }
  };

  const handle1RmChange = (type: 'bench' | 'squat' | 'deadlift' | 'single', val: number) => {
    if (type === 'bench') {
      setBench1Rm(val);
      localStorage.setItem('mslift_1rm_bench', String(val));
      if (!isPowerlifting && selectedProgram?.movementCategory === 'BENCH') {
        setCustom1Rm(val);
        localStorage.setItem('mslift_1rm_single', String(val));
      }
      loadDayWorkout(selectedProgramId, selectedWeek, selectedDay, val, squat1Rm, deadlift1Rm, val);
    } else if (type === 'squat') {
      setSquat1Rm(val);
      localStorage.setItem('mslift_1rm_squat', String(val));
      if (!isPowerlifting && selectedProgram?.movementCategory === 'SQUAT') {
        setCustom1Rm(val);
        localStorage.setItem('mslift_1rm_single', String(val));
      }
      loadDayWorkout(selectedProgramId, selectedWeek, selectedDay, bench1Rm, val, deadlift1Rm, val);
    } else if (type === 'deadlift') {
      setDeadlift1Rm(val);
      localStorage.setItem('mslift_1rm_deadlift', String(val));
      if (!isPowerlifting && selectedProgram?.movementCategory === 'DEADLIFT') {
        setCustom1Rm(val);
        localStorage.setItem('mslift_1rm_single', String(val));
      }
      loadDayWorkout(selectedProgramId, selectedWeek, selectedDay, bench1Rm, squat1Rm, val, val);
    } else {
      setCustom1Rm(val);
      localStorage.setItem('mslift_1rm_single', String(val));
      if (selectedProgram?.movementCategory === 'BENCH') {
        setBench1Rm(val);
        localStorage.setItem('mslift_1rm_bench', String(val));
      }
      if (selectedProgram?.movementCategory === 'SQUAT') {
        setSquat1Rm(val);
        localStorage.setItem('mslift_1rm_squat', String(val));
      }
      if (selectedProgram?.movementCategory === 'DEADLIFT') {
        setDeadlift1Rm(val);
        localStorage.setItem('mslift_1rm_deadlift', String(val));
      }
      loadDayWorkout(selectedProgramId, selectedWeek, selectedDay, val, val, val, val);
    }
  };

  const parseJsonSafe = (rawJson: string, fallback: any = []) => {
    try {
      return JSON.parse(rawJson);
    } catch {
      return fallback;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Дневник тренировок
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Запись тренировок по выбранной программе и добавление подсобных упражнений
              </p>
            </div>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-3 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 self-end ml-auto">
            <div className="text-right">
              <span className="block text-[11px] text-slate-400">Записей в дневнике</span>
              <span className="text-2xl font-black text-white font-mono">
                {diaryHistory.length}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm flex items-center gap-3 shadow-lg shadow-emerald-500/10 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-rose-300 text-sm flex items-center gap-3 animate-fade-in">
          <Info className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN WORKOUT LOGGING PANEL (PROGRAM SELECTOR + BASE + ACCESSORIES)        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: PROGRAM SELECTOR & BASE EXERCISES (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Select Program, Week & Day */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">1. Ваша тренировочная программа</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {programs.length} доступно
              </span>
            </div>

            {/* Program Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Программа, по которой тренируетесь:
              </label>
              <select
                value={selectedProgramId}
                onChange={(e) => {
                  const newProgId = e.target.value;
                  setSelectedProgramId(newProgId);
                  setSelectedWeek(1);
                  setSelectedDay(1);
                  const p = programs.find((pr) => pr.id === newProgId);
                  let c1rm = custom1Rm;
                  if (p) {
                    if (p.movementCategory === 'BENCH') { c1rm = bench1Rm; setCustom1Rm(bench1Rm); }
                    else if (p.movementCategory === 'SQUAT') { c1rm = squat1Rm; setCustom1Rm(squat1Rm); }
                    else if (p.movementCategory === 'DEADLIFT') { c1rm = deadlift1Rm; setCustom1Rm(deadlift1Rm); }
                  }
                  loadDayWorkout(newProgId, 1, 1, bench1Rm, squat1Rm, deadlift1Rm, c1rm);
                }}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {programs.map((prog) => (
                  <option key={prog.id} value={prog.id}>
                    {prog.id === 'custom-free-workout' ? '⚡ ' : ''}{prog.name} {prog.id !== 'custom-free-workout' ? `(${prog.durationWeeks} нед.)` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Week, Day, and Date Pickers */}
            {selectedProgram && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* Week */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Неделя цикла:
                  </label>
                  <select
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {Array.from({ length: selectedProgram.durationWeeks }, (_, i) => i + 1).map((w) => (
                      <option key={w} value={w}>
                        Неделя {w}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Day */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    День тренировки (до 7 дн.):
                  </label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                      <option key={d} value={d}>
                        День {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Workout Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Дата тренировки:
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={workoutDate}
                      onChange={(e) => setWorkoutDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 1RM Inputs for calculations (only for fixed-formula programs) */}
            {selectedProgram && !isCustomWorkout && (
              <div className="pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="block text-xs font-semibold text-slate-400">
                    Ваши рабочие 1ПМ для расчета весов:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      loadDayWorkout(selectedProgramId, selectedWeek, selectedDay, bench1Rm, squat1Rm, deadlift1Rm, custom1Rm);
                      hardware.haptic('success');
                      setSuccessMessage('Веса в дневнике успешно пересчитаны!');
                      setTimeout(() => setSuccessMessage(''), 3000);
                    }}
                    className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Пересчитать веса</span>
                  </button>
                </div>
                {isPowerlifting ? (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                      <span className="text-[11px] font-bold text-emerald-400 block mb-0.5">
                        Присед:
                      </span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          value={squat1Rm}
                          onChange={(e) => handle1RmChange('squat', Number(e.target.value))}
                          className="w-full bg-slate-800 text-white font-mono font-bold text-sm px-2 py-1 rounded border border-slate-700"
                        />
                        <span className="text-xs text-slate-500 font-mono">кг</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                      <span className="text-[11px] font-bold text-indigo-400 block mb-0.5">
                        Жим:
                      </span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          value={bench1Rm}
                          onChange={(e) => handle1RmChange('bench', Number(e.target.value))}
                          className="w-full bg-slate-800 text-white font-mono font-bold text-sm px-2 py-1 rounded border border-slate-700"
                        />
                        <span className="text-xs text-slate-500 font-mono">кг</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                      <span className="text-[11px] font-bold text-orange-400 block mb-0.5">
                        Тяга:
                      </span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          value={deadlift1Rm}
                          onChange={(e) => handle1RmChange('deadlift', Number(e.target.value))}
                          className="w-full bg-slate-800 text-white font-mono font-bold text-sm px-2 py-1 rounded border border-slate-700"
                        />
                        <span className="text-xs text-slate-500 font-mono">кг</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 max-w-xs">
                    <span className="text-xs font-bold text-slate-300">1ПМ в движении:</span>
                    <input
                      type="number"
                      step="0.5"
                      value={custom1Rm}
                      onChange={(e) => handle1RmChange('single', Number(e.target.value))}
                      className="w-20 bg-slate-800 text-white font-mono font-bold text-sm px-2 py-1 rounded border border-slate-700 text-center"
                    />
                    <span className="text-xs text-slate-500 font-mono">кг</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card: Base Exercises of the Day */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-indigo-400" />
                  {isCustomWorkout ? 'Базовые упражнения (Свой план)' : 'Базовые упражнения дня из программы'}
                </h3>
                <span className="text-xs text-slate-400">
                  {isCustomWorkout ? `Свободная тренировка • День ${selectedDay}` : `Неделя ${selectedWeek} • День ${selectedDay}`}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                {isCustomWorkout
                  ? `${customBaseList.length} упр.`
                  : `${baseTemplates.length} ${baseTemplates.length === 1 ? 'фаза' : 'подхода/фаз'}`}
              </span>
            </div>

            {isCustomWorkout ? (
              /* Custom Free Workout Builder & List */
              <div className="space-y-4">
                {/* Form to add custom base exercise */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-300 block">
                    Добавить базовое упражнение в тренировку:
                  </span>

                  {/* Quick suggestions */}
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_BASE_EXERCISES.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setCustomBaseName(name)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
                      >
                        {name}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleAddCustomBase} className="space-y-3 pt-1">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Название упражнения (напр. Жим лежа, Присед...)"
                        value={customBaseName}
                        onChange={(e) => setCustomBaseName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Подходы
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={customBaseSets}
                          onChange={(e) => setCustomBaseSets(Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-center text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Повторения
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={customBaseReps}
                          onChange={(e) => setCustomBaseReps(Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-center text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Вес (кг)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={customBaseWeight}
                          onChange={(e) => setCustomBaseWeight(e.target.value)}
                          placeholder="100"
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-center text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/25 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Добавить базовое упражнение</span>
                    </button>
                  </form>
                </div>

                {/* List of custom base exercises */}
                {customBaseList.length === 0 ? (
                  <div className="p-6 text-center bg-slate-900/40 rounded-xl border border-slate-800/80 text-slate-400 text-xs">
                    Пока нет добавленных базовых упражнений. Добавьте упражнения через форму выше или запишите только подсобку / кардио в блоке справа!
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {customBaseList.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                          customCompletedSets[idx]
                            ? 'border-emerald-500/50 bg-emerald-950/20 shadow-sm shadow-emerald-500/10'
                            : 'border-slate-800 bg-slate-900/80'
                        }`}
                      >
                        <div className="flex-1 pr-2">
                          <span
                            className={`font-bold text-sm block transition ${
                              customCompletedSets[idx] ? 'text-emerald-300 line-through' : 'text-white'
                            }`}
                          >
                            {item.exerciseName}
                          </span>
                          <span className="text-xs text-slate-400 mt-0.5 block">
                            {item.sets} {item.sets === 1 ? 'подход' : item.sets < 5 ? 'подхода' : 'подходов'} ×{' '}
                            {item.reps} {item.reps === 1 ? 'повтор' : item.reps < 5 ? 'повтора' : 'повторений'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="0.5"
                              value={item.calculatedWeightKg}
                              onChange={(e) => handleUpdateCustomBaseWeight(idx, Number(e.target.value))}
                              className="w-16 bg-slate-800 text-white font-mono font-bold text-sm px-2 py-1.5 rounded-lg border border-slate-700 text-right focus:outline-none focus:border-indigo-500"
                            />
                            <span className="text-xs text-slate-400 font-mono">кг</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleCompleteCustomSet(idx, item)}
                            title={customCompletedSets[idx] ? 'Снять отметку' : 'Отметить подход и начать отдых'}
                            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                              customCompletedSets[idx]
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/25 scale-105'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-slate-600'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveCustomBase(idx)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                            title="Удалить упражнение"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : loadingBase ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                Загрузка упражнений программы...
              </div>
            ) : baseTemplates.length === 0 ? (
              <div className="p-6 text-center bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 text-xs">
                На этот день в программе нет базовых упражнений (день отдыха или кардио/восстановления). Вы можете записать подсобные упражнения, кардио или растяжку в блоке справа!
              </div>
            ) : (
              <div className="space-y-2.5">
                {baseTemplates.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      completedSets[idx]
                        ? 'border-emerald-500/50 bg-emerald-950/20 shadow-sm shadow-emerald-500/10'
                        : 'border-slate-800 bg-slate-900/80'
                    }`}
                  >
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-sm transition ${
                            completedSets[idx] ? 'text-emerald-300 line-through' : 'text-white'
                          }`}
                        >
                          {item.exerciseName}
                        </span>
                        <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                          {item.intensityPercentage}%
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 mt-0.5 block">
                        {item.sets} {item.sets === 1 ? 'подход' : item.sets < 5 ? 'подхода' : 'подходов'} ×{' '}
                        {item.reps} {item.reps === 1 ? 'повтор' : item.reps < 5 ? 'повтора' : 'повторений'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Weight Input (Calculated with option to adjust actual lifted weight) */}
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          value={customBaseWeights[idx] !== undefined ? customBaseWeights[idx] : item.calculatedWeightKg}
                          onChange={(e) =>
                            setCustomBaseWeights({
                              ...customBaseWeights,
                              [idx]: Number(e.target.value)
                            })
                          }
                          className="w-16 bg-slate-800 text-white font-mono font-bold text-sm px-2 py-1.5 rounded-lg border border-slate-700 text-right focus:outline-none focus:border-indigo-500"
                        />
                        <span className="text-xs text-slate-400 font-mono">кг</span>
                      </div>

                      {/* Complete set button with haptic & rest timer */}
                      <button
                        type="button"
                        onClick={() => toggleCompleteSet(idx, item)}
                        title={completedSets[idx] ? 'Снять отметку' : 'Отметить подход и начать отдых'}
                        className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                          completedSets[idx]
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/25 scale-105'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-slate-600'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACCESSORIES & SAVE WORKOUT (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Add Accessory Exercises */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  2. Дописать подсобные упражнения
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                +{accessories.length} добавлено
              </span>
            </div>

            {/* Quick Chips of popular powerlifting accessories */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Популярная подсобка (нажмите для быстрой вставки):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_ACCESSORIES.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setAccName(chip)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Add Accessory Form */}
            <form onSubmit={handleAddAccessory} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Название упражнения:
                </label>
                <input
                  type="text"
                  placeholder="Например: Жим гантелей на наклонной скамье"
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Подходы:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={accSets}
                    onChange={(e) => setAccSets(Number(e.target.value))}
                    className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm text-center focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Повторения:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={accReps}
                    onChange={(e) => setAccReps(Number(e.target.value))}
                    className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm text-center focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Вес (кг):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="0"
                    value={accWeight}
                    onChange={(e) => setAccWeight(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm text-center focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Примечание (например: RPE 8, пауза 2 сек)"
                  value={accNotes}
                  onChange={(e) => setAccNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Добавить подсобку в этот день</span>
              </button>
            </form>

            {/* List of Added Accessories for this workout */}
            {accessories.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300 block">
                  Подсобка к текущему дню:
                </span>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {accessories.map((acc, i) => (
                    <div
                      key={acc.id || i}
                      className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-xs text-emerald-400 block">
                          {acc.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {acc.sets} × {acc.reps}{' '}
                          {acc.weightKg ? `• ${acc.weightKg} кг` : ''}{' '}
                          {acc.notes ? `(${acc.notes})` : ''}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveAccessory(acc.id)}
                        className="p-1 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-lg transition cursor-pointer"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* General Workout Notes */}
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Заметка к тренировке (самочувствие, сон, восстановление):
              </label>
              <textarea
                rows={2}
                placeholder="Хороший драйв, техника стабильная..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Primary Submit Button */}
            <button
              onClick={handleSaveWorkout}
              disabled={
                savingWorkout ||
                (isCustomWorkout
                  ? !customBaseList.length && !accessories.length && !notes.trim()
                  : !baseTemplates.length && !accessories.length && !notes.trim())
              }
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white rounded-xl font-extrabold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>
                {savingWorkout ? 'Сохранение...' : 'Записать тренировку в дневник'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPLETED WORKOUTS HISTORY (JOURNAL FEED)                                 */}
      {/* ========================================================================= */}
      <div className="space-y-5 pt-6 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
              <Calendar className="w-6 h-6 text-indigo-400" />
              Журнал тренировок (История дневника)
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Все проведенные тренировки с назначенной программой и выполненной подсобкой
            </p>
          </div>

          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            {diaryHistory.length} записей сохранено
          </span>
        </div>

        {loadingHistory ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Загрузка истории дневника...
          </div>
        ) : diaryHistory.length === 0 ? (
          <div className="py-16 text-center glass-panel rounded-2xl border border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-slate-300 font-bold text-base">Ваш дневник пока пуст</h4>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto mt-1">
              Выберите тренировочную программу выше, при необходимости добавьте подсобные упражнения и
              нажмите «Записать тренировку в дневник»!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {diaryHistory.map((entry) => {
              const baseList: BaseExerciseItem[] = parseJsonSafe(entry.baseExercises, []);
              const accList: AccessoryExerciseItem[] = parseJsonSafe(entry.accessoryExercises, []);

              return (
                <div
                  key={entry.id}
                  className="glass-panel rounded-2xl p-5 border border-slate-800/90 space-y-4 hover:border-slate-700 transition"
                >
                  {/* Entry Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
                          {entry.workoutDate}
                        </span>
                        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          Неделя {entry.weekNumber} • День {entry.dayNumber}
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-base mt-1.5 leading-snug">
                        {entry.programName}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleDeleteDiaryEntry(entry.id)}
                      className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                      title="Удалить запись"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Base Exercises Section */}
                  {baseList.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        База программы:
                      </span>
                      <div className="space-y-1">
                        {baseList.map((b, idx) => (
                          <div
                            key={idx}
                            className="text-xs bg-slate-900/70 p-2 rounded-lg border border-slate-800 flex items-center justify-between"
                          >
                            <span className="font-semibold text-white">{b.exerciseName}</span>
                            <span className="font-mono text-indigo-300 font-bold">
                              {b.sets} × {b.reps} @ {b.calculatedWeightKg} кг{' '}
                              <span className="text-slate-500 text-[10px]">
                                ({b.intensityPercentage}%)
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Accessory Exercises Section */}
                  {accList.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                        Выполненная подсобка:
                      </span>
                      <div className="space-y-1">
                        {accList.map((a, idx) => (
                          <div
                            key={idx}
                            className="text-xs bg-emerald-950/20 p-2 rounded-lg border border-emerald-500/20 flex items-center justify-between diary-accessory-card"
                          >
                            <span className="font-semibold text-emerald-300 acc-name">{a.name}</span>
                            <span className="font-mono text-slate-300 acc-metrics">
                              {a.sets} × {a.reps}
                              {a.weightKg ? ` • ${a.weightKg} кг` : ''}
                              {a.notes ? ` (${a.notes})` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {entry.notes && (
                    <div className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800 text-xs text-slate-400 italic">
                      «{entry.notes}»
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
