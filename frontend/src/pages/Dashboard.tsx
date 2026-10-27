import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dumbbell,
  Flame,
  Trophy,
  Apple,
  Calculator,
  ArrowRight,
  Target,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import type {
  TrainingProgram,
  DailyNutritionResponse,
  NutritionTarget,
  TrainingDiaryResponse
} from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Programs & Selection
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [todayNutrition, setTodayNutrition] = useState<DailyNutritionResponse | null>(null);
  const [nutritionTarget, setNutritionTarget] = useState<NutritionTarget | null>(null);
  const [latestDiaryEntry, setLatestDiaryEntry] = useState<TrainingDiaryResponse | null>(null);

  // Active program from localStorage
  const [activeProgId, setActiveProgId] = useState<string>('');
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [activeDay, setActiveDay] = useState<number>(1);

  // SBD 1RMs from localStorage
  const [bench1Rm, setBench1Rm] = useState<number>(100);
  const [squat1Rm, setSquat1Rm] = useState<number>(140);
  const [deadlift1Rm, setDeadlift1Rm] = useState<number>(160);

  // Express 1RM Calculator widget state
  const [quickWeight, setQuickWeight] = useState<string>('100');
  const [quickReps, setQuickReps] = useState<string>('5');
  const [quickFormula, setQuickFormula] = useState<'EPLEY' | 'BRZYCKI'>('EPLEY');

  useEffect(() => {
    loadAllDashboardData();
  }, []);

  const loadAllDashboardData = async () => {
    // 1. Restore local preferences
    const savedBench = localStorage.getItem('mslift_1rm_bench');
    const savedSquat = localStorage.getItem('mslift_1rm_squat');
    const savedDeadlift = localStorage.getItem('mslift_1rm_deadlift');
    const savedProgId = localStorage.getItem('mslift_diary_prog_id');
    const savedWeek = localStorage.getItem('mslift_diary_week');
    const savedDay = localStorage.getItem('mslift_diary_day');
    const savedTarget = localStorage.getItem('mslift_nutrition_target');

    if (savedBench) setBench1Rm(Number(savedBench));
    if (savedSquat) setSquat1Rm(Number(savedSquat));
    if (savedDeadlift) setDeadlift1Rm(Number(savedDeadlift));
    if (savedProgId) setActiveProgId(savedProgId);
    if (savedWeek) setActiveWeek(Number(savedWeek));
    if (savedDay) setActiveDay(Number(savedDay));

    if (savedTarget) {
      try {
        setNutritionTarget(JSON.parse(savedTarget));
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Fetch server data in parallel
    try {
      const [progs, nutr, diaryEntries] = await Promise.all([
        api.getPrograms(),
        api.getDailyNutrition().catch(() => null),
        api.getDiaryEntries().catch(() => [])
      ]);

      setPrograms(progs);
      if (nutr) setTodayNutrition(nutr);

      if (diaryEntries && diaryEntries.length > 0) {
        setLatestDiaryEntry(diaryEntries[0]);
      } else {
        // Try local diary cache
        const localCache = localStorage.getItem('mslift_diary_cache');
        if (localCache) {
          try {
            const parsed = JSON.parse(localCache);
            if (parsed && parsed.length > 0) {
              setLatestDiaryEntry(parsed[0]);
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    } catch (e) {
      console.error('Ошибка загрузки данных дашборда:', e);
    }
  };

  // Express 1RM calculation
  const weightVal = Number(quickWeight) || 0;
  const repsVal = Number(quickReps) || 0;

  let calculated1RM = 0;
  if (weightVal > 0 && repsVal > 0) {
    if (repsVal === 1) {
      calculated1RM = weightVal;
    } else if (quickFormula === 'EPLEY') {
      calculated1RM = Math.round(weightVal * (1 + repsVal / 30) * 10) / 10;
    } else {
      // Brzycki
      calculated1RM = Math.round((weightVal * 36) / (37 - repsVal) * 10) / 10;
    }
  }

  // Active program object
  const activeProgram = programs.find((p) => p.id === activeProgId) || null;

  // Powerlifting SBD Total
  const sbdTotal = (squat1Rm || 0) + (bench1Rm || 0) + (deadlift1Rm || 0);

  // Nutrition calculations
  const targetCalories = nutritionTarget?.calories || 2600;
  const todayCalories = Math.round(Number(todayNutrition?.totalCalories) || 0);
  const nutritionProgress = Math.min(100, Math.round((todayCalories / targetCalories) * 100));

  // Filter programs for widget
  const displayedPrograms = programs.filter((p) => {
    if (activeCategory === 'ALL') return true;
    return p.movementCategory === activeCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-7 sm:p-10 border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            MSLift — Центр <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-400">силы и прогресса</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            40 проверенных программ для жима лёжа, приседаний, становой тяги и троеборья, экспресс-расчёт 1ПМ,
            дневник тренировок с подсобными упражнениями и спортивный баланс КБЖУ.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/programs"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-indigo-600/25 flex items-center gap-2"
            >
              <Flame className="w-4 h-4" />
              <span>Выбрать программу ({programs.length || 40})</span>
            </Link>

            <Link
              to="/workouts"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-sm rounded-xl transition flex items-center gap-2"
            >
              <Dumbbell className="w-4 h-4 text-indigo-400" />
              <span>Дневник тренировок</span>
            </Link>

            <Link
              to="/nutrition-calculator"
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-sm rounded-xl transition flex items-center gap-2"
            >
              <Target className="w-4 h-4 text-cyan-400" />
              <span>Норма КБЖУ</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3 CORE LIVE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1: POWERLIFTING TOTAL SBD */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-indigo-500/40 transition group">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="flex items-center gap-2 font-bold text-white text-sm">
                <Trophy className="w-4 h-4 text-amber-400" />
                Силовая тройка SBD
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                1ПМ Рекорды
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-amber-300 font-mono">
                {sbdTotal}
              </span>
              <span className="text-sm font-semibold text-slate-400">кг (сумма троеборья)</span>
            </div>

            {/* SBD Breakdown */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Присед</div>
                <div className="text-base font-black text-white font-mono mt-0.5">{squat1Rm} кг</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Жим</div>
                <div className="text-base font-black text-white font-mono mt-0.5">{bench1Rm} кг</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Тяга</div>
                <div className="text-base font-black text-white font-mono mt-0.5">{deadlift1Rm} кг</div>
              </div>
            </div>
          </div>

          <Link
            to="/calculator"
            className="mt-4 pt-3 text-xs text-indigo-400 group-hover:text-indigo-300 font-semibold flex items-center justify-between border-t border-slate-800/60"
          >
            <span>Рассчитать новый 1ПМ</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* CARD 2: ACTIVE PROGRAM & PROGRESS */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-indigo-500/40 transition group">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="flex items-center gap-2 font-bold text-white text-sm">
                <Flame className="w-4 h-4 text-indigo-400" />
                Текущая программа
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                В процессе
              </span>
            </div>

            {activeProgram ? (
              <div className="space-y-3 mt-1">
                <h4 className="text-lg font-extrabold text-white line-clamp-1">
                  {activeProgram.name}
                </h4>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Прогресс цикла:</span>
                  <span className="font-mono font-bold text-indigo-300">
                    Неделя {activeWeek} из {activeProgram.durationWeeks} • День {activeDay}
                  </span>
                </div>

                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((activeWeek / (activeProgram.durationWeeks || 1)) * 100)
                      )}%`
                    }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2 mt-1">
                <h4 className="text-base font-bold text-slate-300">Программа не выбрана</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Выберите программу жима, приседа или троеборья для автоматического расчёта циклов.
                </p>
              </div>
            )}
          </div>

          <Link
            to={activeProgram ? '/workouts' : '/programs'}
            className="mt-4 pt-3 text-xs text-indigo-400 group-hover:text-indigo-300 font-semibold flex items-center justify-between border-t border-slate-800/60"
          >
            <span>{activeProgram ? 'Продолжить тренировку' : 'Выбрать план'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* CARD 3: NUTRITION TODAY */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-indigo-500/40 transition group">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="flex items-center gap-2 font-bold text-white text-sm">
                <Apple className="w-4 h-4 text-cyan-400" />
                Питание за сегодня
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                {nutritionTarget?.goalName || 'Норма'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-cyan-300 font-mono">
                {todayCalories}
              </span>
              <span className="text-sm font-semibold text-slate-400 font-mono">
                / {targetCalories} ккал
              </span>
            </div>

            {/* Macro bars */}
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 mt-3">
              <div
                style={{ width: `${nutritionProgress}%` }}
                className={`h-full transition-all duration-500 ${
                  nutritionProgress > 105 ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                }`}
              />
            </div>

            <div className="grid grid-cols-3 gap-1 mt-3 pt-2 text-center text-xs font-mono text-slate-400">
              <div>
                Б: <strong className="text-indigo-400">{todayNutrition?.totalProtein || 0}г</strong>
              </div>
              <div>
                Ж: <strong className="text-amber-400">{todayNutrition?.totalFat || 0}г</strong>
              </div>
              <div>
                У: <strong className="text-cyan-400">{todayNutrition?.totalCarbs || 0}г</strong>
              </div>
            </div>
          </div>

          <Link
            to="/nutrition"
            className="mt-4 pt-3 text-xs text-indigo-400 group-hover:text-indigo-300 font-semibold flex items-center justify-between border-t border-slate-800/60"
          >
            <span>Открыть дневник КБЖУ</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* QUICK 1RM CALCULATOR + FEATURED PROGRAMS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Express 1RM Calculator (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-400" />
              Экспресс-расчёт 1ПМ
            </h3>

            {/* Formula switch */}
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setQuickFormula('EPLEY')}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  quickFormula === 'EPLEY'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Epley
              </button>
              <button
                type="button"
                onClick={() => setQuickFormula('BRZYCKI')}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  quickFormula === 'BRZYCKI'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Brzycki
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Поднятый вес (кг)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={quickWeight}
                onChange={(e) => setQuickWeight(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono font-bold text-base focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Повторения
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={quickReps}
                onChange={(e) => setQuickReps(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono font-bold text-base focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-950 relative overflow-hidden text-center space-y-2">
            <div className="absolute right-0 top-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Расчетный одноповторный максимум
            </span>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                {calculated1RM}
              </span>
              <span className="text-xl font-bold text-indigo-400">кг</span>
            </div>
            <span className="text-xs text-slate-400 block">
              Расчитано на основе {quickWeight} кг × {quickReps} повторений (EPLEY)
            </span>
          </div>

          {/* Quick Percentages */}
          {calculated1RM > 0 && (
            <div className="grid grid-cols-4 gap-2 text-center pt-1 text-xs">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-semibold">90%</span>
                <span className="font-mono font-bold text-white">
                  {Math.round(calculated1RM * 0.9 * 2) / 2} кг
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-semibold">80%</span>
                <span className="font-mono font-bold text-white">
                  {Math.round(calculated1RM * 0.8 * 2) / 2} кг
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-semibold">75%</span>
                <span className="font-mono font-bold text-white">
                  {Math.round(calculated1RM * 0.75 * 2) / 2} кг
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-semibold">70%</span>
                <span className="font-mono font-bold text-white">
                  {Math.round(calculated1RM * 0.7 * 2) / 2} кг
                </span>
              </div>
            </div>
          )}

          <Link
            to="/calculator"
            className="block text-center text-xs text-indigo-400 hover:text-indigo-300 font-semibold pt-1"
          >
            Открыть полный 1ПМ калькулятор с разбивкой по RPE →
          </Link>
        </div>

        {/* Featured Programs + Recent Workout (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Recent Workout Preview */}
          {latestDiaryEntry && (
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Последняя тренировка из дневника
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {latestDiaryEntry.workoutDate}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-white">
                    {latestDiaryEntry.programName}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Неделя {latestDiaryEntry.weekNumber} • День {latestDiaryEntry.dayNumber}
                  </p>
                </div>

                <Link
                  to="/workouts"
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>Весь журнал</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                </Link>
              </div>
            </div>
          )}

          {/* Featured Programs List */}
          <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-indigo-400" />
                Популярные тренировочные программы
              </h3>
              <Link to="/programs" className="text-xs text-indigo-400 hover:underline font-semibold">
                Все {programs.length || 40} программ →
              </Link>
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'ALL', label: 'Все' },
                { id: 'POWERLIFTING', label: 'Троеборье' },
                { id: 'BENCH', label: 'Жим лёжа' },
                { id: 'SQUAT', label: 'Приседания' },
                { id: 'DEADLIFT', label: 'Становая тяга' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Program Items */}
            <div className="space-y-3 pt-1">
              {displayedPrograms.slice(0, 5).map((p) => {
                const getCategoryBadge = (cat?: string) => {
                  switch (cat) {
                    case 'POWERLIFTING':
                      return { text: 'Троеборье', color: 'bg-purple-500/10 text-purple-300 border-purple-500/20' };
                    case 'BENCH':
                      return { text: 'Жим лёжа', color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' };
                    case 'SQUAT':
                      return { text: 'Присед', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' };
                    case 'DEADLIFT':
                      return { text: 'Тяга', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' };
                    default:
                      return { text: 'Универсальная', color: 'bg-slate-800 text-slate-300 border-slate-700' };
                  }
                };

                const badge = getCategoryBadge(p.movementCategory);

                return (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/programs?program=${p.id}`)}
                    className="p-3.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 rounded-xl flex items-center justify-between cursor-pointer transition group"
                  >
                    <div className="pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                          {p.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                          {badge.text}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {p.durationWeeks} нед
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                        {p.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
