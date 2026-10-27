import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Flame,
  Scale,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import type { NutritionTarget } from '../types';

interface ActivityOption {
  level: number;
  multiplier: number;
  title: string;
  description: string;
}

const ACTIVITY_OPTIONS: ActivityOption[] = [
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

export const NutritionCalculator: React.FC = () => {
  const navigate = useNavigate();

  // User input states
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(25);
  const [height, setHeight] = useState<number>(180);
  const [weight, setWeight] = useState<number>(82);
  const [bodyFat, setBodyFat] = useState<string>(''); // optional
  const [activityLevel, setActivityLevel] = useState<number>(3); // default: 1.55

  // Active chosen target state from localStorage
  const [activeTarget, setActiveTarget] = useState<NutritionTarget | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Load saved profile and target on mount
  useEffect(() => {
    const savedTarget = localStorage.getItem('mslift_nutrition_target');
    if (savedTarget) {
      try {
        setActiveTarget(JSON.parse(savedTarget));
      } catch (e) {
        console.error(e);
      }
    }

    const savedProfile = localStorage.getItem('mslift_calc_profile');
    if (savedProfile) {
      try {
        const p = JSON.parse(savedProfile);
        if (p.gender) setGender(p.gender);
        if (p.age) setAge(p.age);
        if (p.height) setHeight(p.height);
        if (p.weight) setWeight(p.weight);
        if (p.bodyFat !== undefined) setBodyFat(p.bodyFat);
        if (p.activityLevel) setActivityLevel(p.activityLevel);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save profile to localStorage whenever inputs change
  useEffect(() => {
    localStorage.setItem(
      'mslift_calc_profile',
      JSON.stringify({ gender, age, height, weight, bodyFat, activityLevel })
    );
  }, [gender, age, height, weight, bodyFat, activityLevel]);

  // Selected activity object
  const selectedActivity =
    ACTIVITY_OPTIONS.find((a) => a.level === activityLevel) || ACTIVITY_OPTIONS[2];

  // Calculation logic
  const parsedFat = bodyFat.trim() !== '' ? Number(bodyFat) : null;
  const isKatchMcArdle = parsedFat !== null && !isNaN(parsedFat) && parsedFat > 3 && parsedFat < 60;

  let bmr: number;
  let formulaName = '';
  let leanBodyMass = 0;

  if (isKatchMcArdle) {
    // Katch-McArdle formula
    leanBodyMass = weight * (100 - parsedFat!) / 100;
    bmr = 370 + 21.6 * leanBodyMass;
    formulaName = `Кэтча — МакАрдла (сухая масса: ${leanBodyMass.toFixed(1)} кг)`;
  } else {
    // Mifflin - St Jeor formula
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    formulaName = 'Миффлина — Сан-Жеора';
  }

  const tdee = Math.round(bmr * selectedActivity.multiplier);
  const roundedBmr = Math.round(bmr);

  // 1) СБРОС ВЕСА (Дефицит 15%)
  const deficitCalories = Math.round(tdee * 0.85);
  const deficitProtein = Math.round(2.2 * weight);
  const deficitFat = Math.round(0.9 * weight);
  const deficitCarbs = Math.max(
    0,
    Math.round((deficitCalories - (deficitProtein * 4 + deficitFat * 9)) / 4)
  );

  // 2) ПОДДЕРЖАНИЕ (100%)
  const maintCalories = tdee;
  const maintProtein = Math.round(1.8 * weight);
  const maintFat = Math.round(1.0 * weight);
  const maintCarbs = Math.max(
    0,
    Math.round((maintCalories - (maintProtein * 4 + maintFat * 9)) / 4)
  );

  // 3) НАБОР МАССЫ (Профицит 15%)
  const surplusCalories = Math.round(tdee * 1.15);
  const surplusProtein = Math.round(2.0 * weight);
  const surplusFat = Math.round(1.0 * weight);
  const surplusCarbs = Math.max(
    0,
    Math.round((surplusCalories - (surplusProtein * 4 + surplusFat * 9)) / 4)
  );

  // Target plans config
  const plans = [
    {
      id: 'DEFICIT' as const,
      title: 'Сброс веса',
      badge: 'Сушка / Весогонка (-15%)',
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      icon: TrendingDown,
      iconColor: 'text-amber-400',
      cardBorder: 'hover:border-amber-500/50',
      calories: deficitCalories,
      protein: deficitProtein,
      fat: deficitFat,
      carbs: deficitCarbs,
      description: 'Максимальное сохранение мышечной массы и силовых показателей при снижении процента жира.',
      proteinRate: '2.2 г/кг',
      fatRate: '0.9 г/кг'
    },
    {
      id: 'MAINTENANCE' as const,
      title: 'Поддержание веса',
      badge: 'Рекомпозиция (100%)',
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      icon: Scale,
      iconColor: 'text-cyan-400',
      cardBorder: 'hover:border-cyan-500/50',
      calories: maintCalories,
      protein: maintProtein,
      fat: maintFat,
      carbs: maintCarbs,
      description: 'Стабильный вес, уверенное восстановление между тренировками и технический прогресс в движениях.',
      proteinRate: '1.8 г/кг',
      fatRate: '1.0 г/кг'
    },
    {
      id: 'SURPLUS' as const,
      title: 'Набор массы',
      badge: 'Силовой рост (+15%)',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      icon: TrendingUp,
      iconColor: 'text-emerald-400',
      cardBorder: 'hover:border-emerald-500/50',
      calories: surplusCalories,
      protein: surplusProtein,
      fat: surplusFat,
      carbs: surplusCarbs,
      description: 'Создание оптимального профицита для прогресса в жиме, приседе, тяге и набора чистой мышечной ткани.',
      proteinRate: '2.0 г/кг',
      fatRate: '1.0 г/кг'
    }
  ];

  const handleSelectTarget = (plan: typeof plans[0]) => {
    const newTarget: NutritionTarget = {
      calories: plan.calories,
      protein: plan.protein,
      fat: plan.fat,
      carbs: plan.carbs,
      goalType: plan.id,
      goalName: plan.title,
      updatedAt: new Date().toISOString()
    };

    setActiveTarget(newTarget);
    localStorage.setItem('mslift_nutrition_target', JSON.stringify(newTarget));

    setToastMessage(`Цель «${plan.title}» (${plan.calories} ккал) успешно сохранена для Дневника КБЖУ!`);
    setTimeout(() => setToastMessage(''), 5000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 border border-emerald-500/50 rounded-2xl text-emerald-300 text-sm flex items-center gap-3 shadow-2xl shadow-emerald-500/20 animate-fade-in backdrop-blur-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => navigate('/nutrition')}
            className="ml-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <span>В дневник</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Калькулятор и дневная норма КБЖУ
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Специализированный расчёт метаболизма и макронутриентов для силовых атлетов
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/nutrition')}
            className="self-start md:self-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
          >
            <span>Перейти в Дневник КБЖУ</span>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* INPUT FORM (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Параметры тела
            </h3>

            {/* Gender Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Биологический пол
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    gender === 'male'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Мужской
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    gender === 'female'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Женский
                </button>
              </div>
            </div>

            {/* Age */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-400">Возраст (лет)</span>
                <span className="font-mono font-bold text-indigo-400 text-sm">{age}</span>
              </div>
              <input
                type="range"
                min="14"
                max="80"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Height */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-400">Рост (см)</span>
                <span className="font-mono font-bold text-indigo-400 text-sm">{height} см</span>
              </div>
              <input
                type="range"
                min="130"
                max="220"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Weight */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-400">Текущий вес (кг)</span>
                <span className="font-mono font-bold text-indigo-400 text-sm">{weight} кг</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="40"
                  max="180"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="flex-1 accent-indigo-500 cursor-pointer"
                />
                <input
                  type="number"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-20 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-center text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Body Fat (Optional) */}
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <span>Процент жира в организме (%)</span>
                  <span className="text-[10px] text-slate-500 font-normal">(опционально)</span>
                </label>
                {bodyFat !== '' && (
                  <button
                    type="button"
                    onClick={() => setBodyFat('')}
                    className="text-[11px] text-slate-400 hover:text-rose-400 transition cursor-pointer"
                  >
                    Сбросить
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="4"
                  max="55"
                  placeholder="Например, 15"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  %
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Заполните для расчёта по спортивной формуле Кэтча-МакАрдла</span>
              </p>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Уровень физической активности
              </label>
              <div className="space-y-2">
                {ACTIVITY_OPTIONS.map((opt) => (
                  <div
                    key={opt.level}
                    onClick={() => setActivityLevel(opt.level)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      activityLevel === opt.level
                        ? 'bg-indigo-600/15 border-indigo-500 text-white'
                        : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{opt.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 font-mono text-indigo-300 font-bold">
                          ×{opt.multiplier}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                        {opt.description}
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        activityLevel === opt.level
                          ? 'border-indigo-400 bg-indigo-500'
                          : 'border-slate-700'
                      }`}
                    >
                      {activityLevel === opt.level && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS & TARGET PLANS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary Metric BMR & TDEE */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-gradient-to-br from-indigo-950/30 to-slate-900/40">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Базовый обмен (BMR)
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {roundedBmr} <span className="text-xs font-normal text-slate-400">ккал/день</span>
                  </div>
                </div>
              </div>

              <div className="h-8 w-px bg-slate-800 hidden sm:block" />

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Расход с активностью (TDEE)
                  </div>
                  <div className="text-2xl font-black text-cyan-300 font-mono">
                    {tdee} <span className="text-xs font-normal text-slate-400">ккал/день</span>
                  </div>
                </div>
              </div>

              <div className="w-full pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  Используемая формула:{' '}
                  <strong className="text-slate-200">{formulaName}</strong>
                </span>
                <span className="font-mono text-indigo-400 font-semibold">
                  Множитель: ×{selectedActivity.multiplier}
                </span>
              </div>
            </div>
          </div>

          {/* 3 Interactive Plan Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" />
              Готовые планы КБЖУ для вашей цели
            </h3>

            {plans.map((plan) => {
              const Icon = plan.icon;
              const isSelected = activeTarget?.goalType === plan.id;

              // Macro calorie shares
              const proteinKcal = plan.protein * 4;
              const fatKcal = plan.fat * 9;
              const carbsKcal = plan.carbs * 4;
              const totalKcal = proteinKcal + fatKcal + carbsKcal || 1;

              const proteinPct = Math.round((proteinKcal / totalKcal) * 100);
              const fatPct = Math.round((fatKcal / totalKcal) * 100);
              const carbsPct = Math.max(0, 100 - proteinPct - fatPct);

              return (
                <div
                  key={plan.id}
                  className={`glass-panel rounded-2xl p-6 border transition-all duration-300 relative ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/20 shadow-xl shadow-indigo-500/10'
                      : `border-slate-800/80 ${plan.cardBorder}`
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${plan.iconColor}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-white">{plan.title}</h4>
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${plan.badgeColor}`}
                          >
                            {plan.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{plan.description}</p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0">
                      <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                        {plan.calories.toLocaleString()}{' '}
                        <span className="text-xs font-semibold text-slate-400">ккал</span>
                      </div>
                    </div>
                  </div>

                  {/* Multi-segment Macro Bar */}
                  <div className="space-y-2 mb-5">
                    <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
                      <div
                        style={{ width: `${proteinPct}%` }}
                        className="bg-indigo-500 transition-all duration-500"
                        title={`Белки: ${proteinPct}%`}
                      />
                      <div
                        style={{ width: `${fatPct}%` }}
                        className="bg-amber-500 transition-all duration-500"
                        title={`Жиры: ${fatPct}%`}
                      />
                      <div
                        style={{ width: `${carbsPct}%` }}
                        className="bg-cyan-500 transition-all duration-500"
                        title={`Углеводы: ${carbsPct}%`}
                      />
                    </div>

                    {/* Macro Breakdown Numbers */}
                    <div className="grid grid-cols-3 gap-2 text-center pt-1">
                      {/* Protein */}
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                          Белки ({plan.proteinRate})
                        </div>
                        <div className="text-base font-black text-white font-mono mt-0.5">
                          {plan.protein} <span className="text-xs font-normal text-slate-400">г</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{proteinPct}% ккал</div>
                      </div>

                      {/* Fat */}
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                          Жиры ({plan.fatRate})
                        </div>
                        <div className="text-base font-black text-white font-mono mt-0.5">
                          {plan.fat} <span className="text-xs font-normal text-slate-400">г</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{fatPct}% ккал</div>
                      </div>

                      {/* Carbs */}
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                          Углеводы
                        </div>
                        <div className="text-base font-black text-white font-mono mt-0.5">
                          {plan.carbs} <span className="text-xs font-normal text-slate-400">г</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{carbsPct}% ккал</div>
                      </div>
                    </div>
                  </div>

                  {/* Apply Target Button */}
                  <button
                    type="button"
                    onClick={() => handleSelectTarget(plan)}
                    className={`w-full py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Эта цель уже выбрана для дневника КБЖУ</span>
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4" />
                        <span>Выбрать эту цель для дневника КБЖУ</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
