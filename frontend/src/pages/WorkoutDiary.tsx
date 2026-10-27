import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Dumbbell,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Layers,
  Info
} from 'lucide-react';
import { api } from '../services/api';
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

export const WorkoutDiary: React.FC = () => {
  // Programs & Selection
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
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
      setPrograms(data);
      if (data.length > 0 && !selectedProgramId) {
        const savedProgId = localStorage.getItem('mslift_diary_prog_id');
        const defaultProg = savedProgId
          ? data.find((p) => p.id === savedProgId) || data[0]
          : data[0];
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

  const selectedProgram = programs.find((p) => p.id === selectedProgramId) || null;
  const isPowerlifting =
    selectedProgram?.movementCategory === 'POWERLIFTING' ||
    selectedProgram?.movementCategory === 'UNIVERSAL';

  const loadDayWorkout = async (progId: string, week: number, day: number) => {
    try {
      setLoadingBase(true);
      let weekData: ProgramWeekResponse[];
      if (isPowerlifting) {
        weekData = await api.getProgramWeek(
          progId,
          week,
          undefined,
          undefined,
          bench1Rm,
          squat1Rm,
          deadlift1Rm
        );
      } else {
        weekData = await api.getProgramWeek(progId, week, undefined, custom1Rm);
      }

      // Filter templates belonging to the selected day
      const dayTemplates = weekData.filter((t) => t.dayNumber === day);
      setBaseTemplates(dayTemplates);

      // Pre-fill custom base weights with calculated weights
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
      const baseExercisesPayload: BaseExerciseItem[] = baseTemplates.map((t, idx) => ({
        exerciseName: t.exerciseName,
        sets: t.sets,
        reps: t.reps,
        intensityPercentage: t.intensityPercentage,
        calculatedWeightKg: customBaseWeights[idx] !== undefined ? customBaseWeights[idx] : t.calculatedWeightKg
      }));

      const requestPayload = {
        programId: selectedProgram.id,
        programName: selectedProgram.name,
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
        `Тренировка дня успешно записана в дневник! (Неделя ${selectedWeek}, День ${selectedDay})`
      );
      setTimeout(() => setSuccessMessage(''), 5000);

      // Reset accessories and notes for the next workout
      setAccessories([]);
      setNotes('');

      // Advance to next day if available
      const maxDays = Math.max(...baseTemplates.map((t) => t.dayNumber), 3);
      if (selectedDay < maxDays) {
        setSelectedDay((prev) => prev + 1);
      } else if (selectedWeek < selectedProgram.durationWeeks) {
        setSelectedWeek((prev) => prev + 1);
        setSelectedDay(1);
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
    } else if (type === 'squat') {
      setSquat1Rm(val);
      localStorage.setItem('mslift_1rm_squat', String(val));
    } else if (type === 'deadlift') {
      setDeadlift1Rm(val);
      localStorage.setItem('mslift_1rm_deadlift', String(val));
    } else {
      setCustom1Rm(val);
      localStorage.setItem('mslift_1rm_single', String(val));
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
          <div className="flex items-center gap-3 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
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
                  setSelectedProgramId(e.target.value);
                  setSelectedWeek(1);
                  setSelectedDay(1);
                }}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {programs.map((prog) => (
                  <option key={prog.id} value={prog.id}>
                    {prog.name} ({prog.durationWeeks} нед.)
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
                    День тренировки:
                  </label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {[1, 2, 3, 4, 5].map((d) => (
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

            {/* 1RM Inputs for calculations */}
            {selectedProgram && (
              <div className="pt-3 border-t border-slate-800/80">
                <span className="block text-xs font-semibold text-slate-400 mb-2">
                  Ваши рабочие 1ПМ для расчета весов:
                </span>
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
                  Базовые упражнения дня из программы
                </h3>
                <span className="text-xs text-slate-400">
                  Неделя {selectedWeek} • День {selectedDay}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                {baseTemplates.length} {baseTemplates.length === 1 ? 'фаза' : 'подхода/фаз'}
              </span>
            </div>

            {loadingBase ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                Загрузка упражнений программы...
              </div>
            ) : baseTemplates.length === 0 ? (
              <div className="p-6 text-center bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 text-xs">
                На этот день по плану отдых или восстановительная пауза.
              </div>
            ) : (
              <div className="space-y-2.5">
                {baseTemplates.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{item.exerciseName}</span>
                        <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                          {item.intensityPercentage}%
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 mt-0.5 block">
                        {item.sets} {item.sets === 1 ? 'подход' : item.sets < 5 ? 'подхода' : 'подходов'} ×{' '}
                        {item.reps} {item.reps === 1 ? 'повтор' : item.reps < 5 ? 'повтора' : 'повторений'}
                      </span>
                    </div>

                    {/* Weight Input (Calculated with option to adjust actual lifted weight) */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400">Вес:</span>
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
                        className="w-18 bg-slate-800 text-white font-mono font-bold text-sm px-2 py-1 rounded-lg border border-slate-700 text-right focus:outline-none focus:border-indigo-500"
                      />
                      <span className="text-xs text-slate-400 font-mono">кг</span>
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
              disabled={savingWorkout || (!baseTemplates.length && !accessories.length)}
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
                            className="text-xs bg-emerald-950/20 p-2 rounded-lg border border-emerald-500/20 flex items-center justify-between"
                          >
                            <span className="font-semibold text-emerald-300">{a.name}</span>
                            <span className="font-mono text-slate-300">
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
