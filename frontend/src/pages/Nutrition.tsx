import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Apple,
  Plus,
  Flame,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Sparkles,
  Calculator,
  Utensils,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Target
} from 'lucide-react';
import { api } from '../services/api';
import type {
  DailyNutritionResponse,
  NutritionEntryDto,
  NutritionEntryRequest,
  NutritionTarget
} from '../types';

// Quick meal presets for athletes
const POPULAR_MEALS = [
  {
    name: 'Овсянка с протеином',
    mealType: 'Завтрак',
    calories: 380,
    protein: 32,
    fat: 7,
    carbs: 48,
    weight: 250
  },
  {
    name: 'Куриное филе с рисом',
    mealType: 'Обед',
    calories: 450,
    protein: 48,
    fat: 6,
    carbs: 50,
    weight: 350
  },
  {
    name: 'Яичница из 3 яиц с тостом',
    mealType: 'Завтрак',
    calories: 320,
    protein: 22,
    fat: 18,
    carbs: 18,
    weight: 180
  },
  {
    name: 'Творог 5% с бананом',
    mealType: 'Перекус',
    calories: 280,
    protein: 32,
    fat: 6,
    carbs: 25,
    weight: 250
  },
  {
    name: 'Стейк из говядины с картофелем',
    mealType: 'Ужин',
    calories: 580,
    protein: 48,
    fat: 24,
    carbs: 42,
    weight: 350
  },
  {
    name: 'Протеиновый шейк на молоке',
    mealType: 'Перекус',
    calories: 240,
    protein: 33,
    fat: 4,
    carbs: 18,
    weight: 300
  },
  {
    name: 'Гречка с тушёной индейкой',
    mealType: 'Обед',
    calories: 420,
    protein: 42,
    fat: 8,
    carbs: 45,
    weight: 350
  },
  {
    name: 'Банан с арахисовой пастой',
    mealType: 'Перекус',
    calories: 260,
    protein: 7,
    fat: 14,
    carbs: 32,
    weight: 150
  }
];

const MEAL_TYPES = ['Завтрак', 'Обед', 'Ужин', 'Перекус'] as const;

export const Nutrition: React.FC = () => {
  const navigate = useNavigate();

  // Selected date state
  const [entryDate, setEntryDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Daily entries & totals
  const [dailyData, setDailyData] = useState<DailyNutritionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Daily target goals (loaded from NutritionCalculator or defaults)
  const [target, setTarget] = useState<NutritionTarget>({
    calories: 2600,
    protein: 180,
    fat: 75,
    carbs: 300,
    goalName: 'Стандартная норма'
  });

  // User input form states for adding a dish
  const [foodName, setFoodName] = useState<string>('');
  const [mealType, setMealType] = useState<string>('Завтрак');
  const [calories, setCalories] = useState<string>('');
  const [protein, setProtein] = useState<string>('');
  const [fat, setFat] = useState<string>('');
  const [carbs, setCarbs] = useState<string>('');
  const [weightGrams, setWeightGrams] = useState<string>('');

  // Filter category in list
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  // Load user target goal from localStorage on mount
  useEffect(() => {
    const savedTarget = localStorage.getItem('mslift_nutrition_target');
    if (savedTarget) {
      try {
        setTarget(JSON.parse(savedTarget));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Fetch daily summary when date changes
  useEffect(() => {
    loadDailySummary(entryDate);
  }, [entryDate]);

  const loadDailySummary = async (date: string) => {
    try {
      setLoading(true);
      const data = await api.getDailyNutrition(date);
      setDailyData(data);
      localStorage.setItem(`mslift_nutrition_${date}`, JSON.stringify(data));
    } catch (err) {
      console.warn('Сервер недоступен, пробуем локальный кэш:', err);
      const cached = localStorage.getItem(`mslift_nutrition_${date}`);
      if (cached) {
        try {
          setDailyData(JSON.parse(cached));
        } catch (e) {
          console.error(e);
        }
      } else {
        setDailyData({
          entries: [],
          totalCalories: 0,
          totalProtein: 0,
          totalFat: 0,
          totalCarbs: 0
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-calculate calories from protein, fat, carbs
  const handleAutoCalcCalories = () => {
    const p = Number(protein) || 0;
    const f = Number(fat) || 0;
    const c = Number(carbs) || 0;
    const calculated = Math.round(p * 4 + f * 9 + c * 4);
    if (calculated > 0) {
      setCalories(String(calculated));
    }
  };

  // Fill form from quick meal chip
  const handleSelectPreset = (preset: typeof POPULAR_MEALS[0]) => {
    setFoodName(preset.name);
    setMealType(preset.mealType);
    setCalories(String(preset.calories));
    setProtein(String(preset.protein));
    setFat(String(preset.fat));
    setCarbs(String(preset.carbs));
    setWeightGrams(preset.weight ? String(preset.weight) : '');
  };

  // Add meal entry
  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) {
      setErrorMessage('Укажите название блюда или продукта');
      return;
    }

    const p = Number(protein) || 0;
    const f = Number(fat) || 0;
    const c = Number(carbs) || 0;
    let cal = Number(calories);

    if (!cal || cal <= 0) {
      cal = Math.round(p * 4 + f * 9 + c * 4);
    }

    if (cal <= 0) {
      setErrorMessage('Укажите калорийность или БЖУ блюда');
      return;
    }

    setErrorMessage('');
    setSubmitting(true);

    const payload: NutritionEntryRequest = {
      foodName: foodName.trim(),
      calories: cal,
      protein: p,
      fat: f,
      carbs: c,
      mealType: mealType,
      weightGrams: weightGrams ? Number(weightGrams) : undefined,
      entryDate: entryDate
    };

    try {
      let createdDto: NutritionEntryDto;

      try {
        createdDto = await api.addNutritionEntry(payload);
      } catch (apiErr) {
        console.warn('API error, saving locally:', apiErr);
        createdDto = {
          id: Math.random().toString(36).substring(2, 9),
          productName: payload.foodName || 'Блюдо',
          weightGrams: payload.weightGrams,
          calories: payload.calories || 0,
          protein: payload.protein || 0,
          fat: payload.fat || 0,
          carbs: payload.carbs || 0,
          mealType: payload.mealType
        };
      }

      // Update daily data locally
      setDailyData((prev) => {
        const prevEntries = prev?.entries || [];
        const newEntries = [createdDto, ...prevEntries];
        const newTotCal = (Number(prev?.totalCalories) || 0) + (payload.calories || 0);
        const newTotP = (Number(prev?.totalProtein) || 0) + (payload.protein || 0);
        const newTotF = (Number(prev?.totalFat) || 0) + (payload.fat || 0);
        const newTotC = (Number(prev?.totalCarbs) || 0) + (payload.carbs || 0);

        const updated: DailyNutritionResponse = {
          entries: newEntries,
          totalCalories: Math.round(newTotCal * 10) / 10,
          totalProtein: Math.round(newTotP * 10) / 10,
          totalFat: Math.round(newTotF * 10) / 10,
          totalCarbs: Math.round(newTotC * 10) / 10
        };

        localStorage.setItem(`mslift_nutrition_${entryDate}`, JSON.stringify(updated));
        return updated;
      });

      setSuccessMessage(`Блюдо «${payload.foodName}» добавлено в дневник!`);
      setTimeout(() => setSuccessMessage(''), 4000);

      // Reset form
      setFoodName('');
      setCalories('');
      setProtein('');
      setFat('');
      setCarbs('');
      setWeightGrams('');
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Не удалось добавить блюдо. Попробуйте еще раз.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete meal entry
  const handleDeleteEntry = async (id?: string) => {
    if (!id) return;
    try {
      try {
        await api.deleteNutritionEntry(id);
      } catch (e) {
        console.warn('Backend delete failed, removing locally:', e);
      }

      setDailyData((prev) => {
        if (!prev) return null;
        const removed = prev.entries.find((e) => e.id === id);
        const filtered = prev.entries.filter((e) => e.id !== id);

        const updated: DailyNutritionResponse = {
          entries: filtered,
          totalCalories: Math.max(0, (Number(prev.totalCalories) || 0) - (removed?.calories || 0)),
          totalProtein: Math.max(0, (Number(prev.totalProtein) || 0) - (removed?.protein || 0)),
          totalFat: Math.max(0, (Number(prev.totalFat) || 0) - (removed?.fat || 0)),
          totalCarbs: Math.max(0, (Number(prev.totalCarbs) || 0) - (removed?.carbs || 0))
        };

        localStorage.setItem(`mslift_nutrition_${entryDate}`, JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('Ошибка удаления записи:', err);
    }
  };

  // Quick date switches
  const handleSetQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setEntryDate(d.toISOString().split('T')[0]);
  };

  const isToday = entryDate === new Date().toISOString().split('T')[0];

  // Totals calculations
  const totalCal = Math.round(Number(dailyData?.totalCalories) || 0);
  const totalProt = Math.round(Number(dailyData?.totalProtein) || 0);
  const totalFat = Math.round(Number(dailyData?.totalFat) || 0);
  const totalCarb = Math.round(Number(dailyData?.totalCarbs) || 0);

  const calProgress = Math.min(100, Math.round((totalCal / (target.calories || 1)) * 100));
  const protProgress = Math.min(100, Math.round((totalProt / (target.protein || 1)) * 100));
  const fatProgress = Math.min(100, Math.round((totalFat / (target.fat || 1)) * 100));
  const carbProgress = Math.min(100, Math.round((totalCarb / (target.carbs || 1)) * 100));

  const remainingCal = target.calories - totalCal;

  // Filter entries
  const displayedEntries = (dailyData?.entries || []).filter((e) => {
    if (activeFilter === 'ALL') return true;
    return e.mealType === activeFilter;
  });

  const getMealIcon = (type?: string) => {
    switch (type) {
      case 'Завтрак':
        return <Coffee className="w-4 h-4 text-amber-400" />;
      case 'Обед':
        return <Sun className="w-4 h-4 text-orange-400" />;
      case 'Ужин':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      default:
        return <Cookie className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm flex items-center gap-3 shadow-lg shadow-emerald-500/10 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-rose-300 text-sm flex items-center gap-3 animate-fade-in">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Дневник питания и КБЖУ
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Персональный учёт съеденных блюд и контроль баланса калорий и макросов
              </p>
            </div>
          </div>

          {/* Date Selector & Target Link */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
              <button
                type="button"
                onClick={() => handleSetQuickDate(-1)}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
              >
                Вчера
              </button>
              <button
                type="button"
                onClick={() => handleSetQuickDate(0)}
                className={`px-2.5 py-1 text-xs rounded-lg transition cursor-pointer ${
                  isToday ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Сегодня
              </button>
              <button
                type="button"
                onClick={() => handleSetQuickDate(1)}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
              >
                Завтра
              </button>
            </div>

            <div className="relative">
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="button"
              onClick={() => navigate('/nutrition-calculator')}
              className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Рассчитать норму КБЖУ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Target Goal Banner & Daily KPI Cards */}
      <div className="space-y-4">
        {/* Active Target Banner */}
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Ваша дневная цель:</span>
                <span className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded-md">
                  {target.goalName || 'Норма'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Цель: <strong className="text-white">{target.calories}</strong> ккал •{' '}
                Б: <strong className="text-indigo-400">{target.protein}г</strong> •{' '}
                Ж: <strong className="text-amber-400">{target.fat}г</strong> •{' '}
                У: <strong className="text-cyan-400">{target.carbs}г</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/nutrition-calculator')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Изменить цель</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 KPI Progress Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Calories */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Калории
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {calProgress}%
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white font-mono">{totalCal}</span>
              <span className="text-xs text-slate-500 font-mono">/ {target.calories} ккал</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                style={{ width: `${calProgress}%` }}
                className={`h-full transition-all duration-500 ${
                  calProgress > 105 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-amber-400'
                }`}
              />
            </div>
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>{remainingCal >= 0 ? `Осталось: ${remainingCal} ккал` : `Превышение: ${Math.abs(remainingCal)} ккал`}</span>
            </div>
          </div>

          {/* Protein */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Белки
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {protProgress}%
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white font-mono">{totalProt}</span>
              <span className="text-xs text-slate-500 font-mono">/ {target.protein} г</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                style={{ width: `${protProgress}%` }}
                className="h-full bg-indigo-500 transition-all duration-500"
              />
            </div>
            <div className="text-[10px] text-slate-500">
              {target.protein - totalProt > 0
                ? `Осталось: ${target.protein - totalProt} г`
                : 'Норма белка выполнена'}
            </div>
          </div>

          {/* Fat */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Жиры
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {fatProgress}%
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white font-mono">{totalFat}</span>
              <span className="text-xs text-slate-500 font-mono">/ {target.fat} г</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                style={{ width: `${fatProgress}%` }}
                className="h-full bg-amber-500 transition-all duration-500"
              />
            </div>
            <div className="text-[10px] text-slate-500">
              {target.fat - totalFat > 0
                ? `Осталось: ${target.fat - totalFat} г`
                : 'Норма жиров достигнута'}
            </div>
          </div>

          {/* Carbs */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Углеводы
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {carbProgress}%
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white font-mono">{totalCarb}</span>
              <span className="text-xs text-slate-500 font-mono">/ {target.carbs} г</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                style={{ width: `${carbProgress}%` }}
                className="h-full bg-cyan-500 transition-all duration-500"
              />
            </div>
            <div className="text-[10px] text-slate-500">
              {target.carbs - totalCarb > 0
                ? `Осталось: ${target.carbs - totalCarb} г`
                : 'Норма углеводов достигнута'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ADD FOOD FORM (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Utensils className="w-4 h-4 text-indigo-400" />
                Добавить блюдо / еду
              </h3>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Свой ввод
              </span>
            </div>

            {/* Quick meal chips */}
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Быстрые шаблоны блюд:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_MEALS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Entry Form */}
            <form onSubmit={handleAddEntry} className="space-y-4 pt-1">
              {/* Meal Type selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Приём пищи
                </label>
                <div className="grid grid-cols-4 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {MEAL_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setMealType(type)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        mealType === type
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dish Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Название блюда или еды *
                </label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="Например: Овсяная каша с бананом"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Weight in grams (optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Вес порции (г) <span className="text-slate-500 font-normal">(опционально)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(e.target.value)}
                    placeholder="250"
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    ГР
                  </span>
                </div>
              </div>

              {/* Macros: Protein, Fat, Carbs */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-indigo-400 mb-1">
                    Белки (г)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    placeholder="25"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-center text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-400 mb-1">
                    Жиры (г)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    placeholder="10"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-center text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-cyan-400 mb-1">
                    Углеводы (г)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    placeholder="45"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-center text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Calories & Auto calc button */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-400">
                    Калории (ккал) *
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoCalcCalories}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Calculator className="w-3 h-3" />
                    <span>Рассчитать из БЖУ</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="Например: 350"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono font-bold text-base focus:outline-none focus:border-indigo-500"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    ККАЛ
                  </span>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{submitting ? 'Запись...' : 'Добавить блюдо в дневник'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* FOOD LOG ENTRIES (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Приёмы пищи за {isToday ? 'сегодня' : entryDate}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 font-mono text-slate-400">
                  {displayedEntries.length}
                </span>
              </div>

              {/* Meal Filter Chips */}
              <div className="flex flex-wrap items-center gap-1">
                {['ALL', ...MEAL_TYPES].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      activeFilter === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat === 'ALL' ? 'Все' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            {loading ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                Загрузка записей дневника...
              </div>
            ) : displayedEntries.length === 0 ? (
              <div className="py-14 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-600">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-slate-300 font-bold text-sm">
                    {activeFilter === 'ALL'
                      ? 'За этот день ещё нет приёмов пищи'
                      : `В категории «${activeFilter}» пока нет записей`}
                  </h4>
                  <p className="text-slate-500 text-xs mt-1">
                    Воспользуйтесь формой слева или выберите один из быстрых шаблонов
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {displayedEntries.map((entry) => (
                  <div
                    key={entry.id || Math.random()}
                    className="p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 rounded-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                        {getMealIcon(entry.mealType)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {entry.productName}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50">
                            {entry.mealType || 'Основной'}
                          </span>
                          {entry.weightGrams && entry.weightGrams > 0 ? (
                            <span className="text-[11px] text-slate-500 font-mono">
                              {entry.weightGrams} г
                            </span>
                          ) : null}
                        </div>

                        {/* Macros */}
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                          <span>
                            Б: <strong className="text-indigo-400">{entry.protein}г</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Ж: <strong className="text-amber-400">{entry.fat}г</strong>
                          </span>
                          <span>•</span>
                          <span>
                            У: <strong className="text-cyan-400">{entry.carbs}г</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t border-slate-800/60 sm:border-0">
                      <div className="text-right">
                        <div className="text-lg font-black text-white font-mono">
                          {Math.round(entry.calories)}{' '}
                          <span className="text-xs font-normal text-slate-400">ккал</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                        title="Удалить запись"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
