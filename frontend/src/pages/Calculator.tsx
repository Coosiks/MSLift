import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Dumbbell,
  Calculator as CalcIcon
} from 'lucide-react';
import { api } from '../services/api';
import type { OneRepMaxResponse } from '../types';

export const Calculator: React.FC = () => {
  const [weight, setWeight] = useState<string>('100');
  const [reps, setReps] = useState<string>('5');
  const [formula, setFormula] = useState<'EPLEY' | 'BRZYCKI'>('EPLEY');
  const [result, setResult] = useState<OneRepMaxResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!weight || !reps || Number(reps) <= 0 || Number(weight) <= 0) {
      setError('Укажите корректный вес и количество повторений');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const data = await api.calculate1RM({
        weight: Number(weight),
        reps: Number(reps),
        formula: formula,
      });
      setResult(data);
    } catch (err: any) {
      setError('Ошибка при расчете. Убедитесь, что сервер запущен.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Local instant calculations for percentage table
  const base1RM = result?.oneRepMax
    ? result.oneRepMax
    : weight && reps
    ? Math.round(Number(weight) * (1 + Number(reps) / 30) * 10) / 10
    : 100;

  const percentageTable = [
    { pct: 100, reps: '1 повтор', rpe: '10' },
    { pct: 95, reps: '2 повтора', rpe: '9.5' },
    { pct: 90, reps: '3-4 повтора', rpe: '9' },
    { pct: 85, reps: '5-6 повторов', rpe: '8.5' },
    { pct: 80, reps: '7-8 повторов', rpe: '8' },
    { pct: 75, reps: '9-10 повторов', rpe: '7.5' },
    { pct: 70, reps: '11-12 повторов', rpe: '7' },
    { pct: 65, reps: '13-15 повторов', rpe: '6.5' },
    { pct: 60, reps: '16-20 повторов', rpe: '6' },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <CalcIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Калькулятор 1ПМ
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Расчёт персонального максимума и рабочих процентов по формулам Эпли и Бржицки
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INPUT FORM (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Dumbbell className="w-5 h-5 text-indigo-400" />
            Параметры подхода
          </h3>

          <form onSubmit={calculate} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Поднятый вес (кг)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono font-bold text-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  placeholder="100"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 font-mono">
                  КГ
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Количество повторений
              </label>
              <input
                type="number"
                min="1"
                max="36"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono font-bold text-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Формула расчета
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormula('EPLEY')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition border ${
                    formula === 'EPLEY'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Эпли (Epley)
                </button>
                <button
                  type="button"
                  onClick={() => setFormula('BRZYCKI')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition border ${
                    formula === 'BRZYCKI'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Бржицки (Brzycki)
                </button>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {formula === 'EPLEY'
                  ? 'Формула Эпли: 1RM = Weight × (1 + Reps/30). Золотой стандарт пауэрлифтинга.'
                  : 'Формула Бржицки: 1RM = Weight × (36 / (37 - Reps)). Более строгая оценка.'}
              </span>
            </div>

            {error && (
              <p className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-indigo-600/25 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Расчет...' : 'Рассчитать 1ПМ'}
            </button>
          </form>
        </div>

        {/* RESULTS & PERCENTAGE TABLE (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Big Result Card */}
          <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-950 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Расчетный одноповторный максимум
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-black text-white font-mono tracking-tight">
                    {base1RM}
                  </span>
                  <span className="text-xl font-bold text-indigo-400">кг</span>
                </div>
                <span className="text-xs text-slate-400 mt-1 block">
                  Расчитано на основе {weight} кг × {reps} повторений ({formula})
                </span>
              </div>

              {/* Side by side formula comparison badge */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1 text-right sm:text-left">
                <div className="text-xs text-slate-400">
                  Epley: <strong className="text-indigo-300 font-mono">{Math.round(Number(weight) * (1 + Number(reps) / 30) * 10) / 10} кг</strong>
                </div>
                <div className="text-xs text-slate-400">
                  Brzycki: <strong className="text-indigo-300 font-mono">
                    {Number(reps) < 37 ? Math.round(Number(weight) * (36 / (37 - Number(reps))) * 10) / 10 : '-'} кг
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Intensity Percentages Table */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Таблица процентов от 1ПМ
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono">
                    <th className="pb-2.5">Процент</th>
                    <th className="pb-2.5">Вес (кг)</th>
                    <th className="pb-2.5">Округл. (2.5 кг)</th>
                    <th className="pb-2.5">Повторений</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {percentageTable.map((row) => {
                    const exact = Math.round((base1RM * row.pct) / 10) / 10;
                    const rounded = Math.round(exact / 2.5) * 2.5;

                    return (
                      <tr key={row.pct} className="hover:bg-slate-900/50 transition">
                        <td className="py-2.5 font-bold text-indigo-400">
                          {row.pct}%
                        </td>
                        <td className="py-2.5 text-white font-bold text-sm">
                          {exact} кг
                        </td>
                        <td className="py-2.5 text-slate-300 font-medium">
                          {rounded} кг
                        </td>
                        <td className="py-2.5 text-slate-400 font-sans">
                          {row.reps}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};