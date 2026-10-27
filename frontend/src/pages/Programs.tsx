import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Flame,
  Info,
  Search,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Sparkles,
  Zap,
  Trophy
} from 'lucide-react';
import { api } from '../services/api';
import type { TrainingProgram, ProgramWeekResponse } from '../types';

type MovementFilter = 'ALL' | 'POWERLIFTING' | 'BENCH' | 'SQUAT' | 'DEADLIFT';

export const Programs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  // Single lift 1RM (for Bench / Squat / Deadlift single programs)
  const [userOneRm, setUserOneRm] = useState<number>(100);

  // Powerlifting individual 1RMs
  const [userSquatOneRm, setUserSquatOneRm] = useState<number>(140);
  const [userBenchOneRm, setUserBenchOneRm] = useState<number>(100);
  const [userDeadliftOneRm, setUserDeadliftOneRm] = useState<number>(160);

  const [roundToPlates, setRoundToPlates] = useState<boolean>(true);
  const [weekData, setWeekData] = useState<ProgramWeekResponse[]>([]);
  const [loadingWeek, setLoadingWeek] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovement, setSelectedMovement] = useState<MovementFilter>('ALL');
  const [filterDuration, setFilterDuration] = useState<string>('ALL');

  // Ref for the horizontal week slider
  const weekSliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Drag-to-scroll state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Fetch all programs on load
  useEffect(() => {
    loadPrograms();
  }, []);

  // Sync selectedProgram with URL query parameter ?program=<id>
  useEffect(() => {
    const programIdFromUrl = searchParams.get('program');
    if (programIdFromUrl && programs.length > 0) {
      const found = programs.find((p) => p.id === programIdFromUrl);
      if (found && (!selectedProgram || selectedProgram.id !== found.id)) {
        openProgram(found, false);
      }
    } else if (!programIdFromUrl && selectedProgram) {
      setSelectedProgram(null);
    }
  }, [searchParams, programs]);

  // When a program is selected, load its week data
  useEffect(() => {
    if (selectedProgram) {
      loadCurrentWeekData(selectedProgram, selectedWeek);
    }
  }, [selectedProgram, selectedWeek]);

  // Check scroll positions for week slider
  const checkSliderScroll = () => {
    if (weekSliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = weekSliderRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkSliderScroll();
  }, [selectedProgram, weekData]);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const data = await api.getPrograms();
      setPrograms(data);
    } catch (err) {
      console.error('Ошибка загрузки программ:', err);
    } finally {
      setLoading(false);
    }
  };

  const isPowerliftingProgram = (prog: TrainingProgram | null) => {
    if (!prog) return false;
    return prog.movementCategory === 'POWERLIFTING' || prog.movementCategory === 'UNIVERSAL';
  };

  const loadCurrentWeekData = async (
    prog: TrainingProgram,
    week: number,
    squatRm = userSquatOneRm,
    benchRm = userBenchOneRm,
    deadliftRm = userDeadliftOneRm,
    singleRm = userOneRm
  ) => {
    try {
      setLoadingWeek(true);
      let data: ProgramWeekResponse[];
      if (isPowerliftingProgram(prog)) {
        data = await api.getProgramWeek(
          prog.id,
          week,
          undefined,
          undefined,
          benchRm,
          squatRm,
          deadliftRm
        );
      } else {
        data = await api.getProgramWeek(prog.id, week, undefined, singleRm);
      }
      setWeekData(data);
    } catch (err) {
      console.error('Ошибка загрузки недели:', err);
    } finally {
      setLoadingWeek(false);
    }
  };

  const openProgram = (prog: TrainingProgram, updateUrl = true) => {
    setSelectedProgram(prog);
    setSelectedWeek(1);

    // Set intelligent default 1RM based on movement category
    if (prog.movementCategory === 'SQUAT') {
      setUserOneRm(140);
    } else if (prog.movementCategory === 'DEADLIFT') {
      setUserOneRm(160);
    } else if (prog.movementCategory === 'BENCH') {
      setUserOneRm(100);
    }

    if (updateUrl) {
      setSearchParams({ program: prog.id });
    }
  };

  const handleBackToList = () => {
    setSelectedProgram(null);
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRecalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProgram) {
      loadCurrentWeekData(
        selectedProgram,
        selectedWeek,
        userSquatOneRm,
        userBenchOneRm,
        userDeadliftOneRm,
        userOneRm
      );
    }
  };

  // Helper: round weight to 2.5 kg plates
  const formatWeight = (rawWeight: number): number => {
    if (!roundToPlates) return rawWeight;
    return Math.round(rawWeight / 2.5) * 2.5;
  };

  // Scroll week slider left/right
  const scrollWeekSlider = (direction: 'left' | 'right') => {
    if (weekSliderRef.current) {
      const scrollAmount = 260;
      weekSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkSliderScroll, 300);
    }
  };

  // Mouse drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!weekSliderRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - weekSliderRef.current.offsetLeft;
    scrollLeftRef.current = weekSliderRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !weekSliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - weekSliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    weekSliderRef.current.scrollLeft = scrollLeftRef.current - walk;
    checkSliderScroll();
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // Category counts: exact counts matching each category
  const powerliftingCount = programs.filter(
    (p) => p.movementCategory === 'POWERLIFTING' || p.movementCategory === 'UNIVERSAL'
  ).length;
  const benchCount = programs.filter((p) => p.movementCategory === 'BENCH').length;
  const squatCount = programs.filter((p) => p.movementCategory === 'SQUAT').length;
  const deadliftCount = programs.filter((p) => p.movementCategory === 'DEADLIFT').length;

  // Filtered programs
  const filteredPrograms = programs.filter((p) => {
    // Movement category filter
    if (selectedMovement !== 'ALL') {
      if (selectedMovement === 'POWERLIFTING') {
        if (p.movementCategory !== 'POWERLIFTING' && p.movementCategory !== 'UNIVERSAL') {
          return false;
        }
      } else if (p.movementCategory !== selectedMovement) {
        return false;
      }
    }

    // Text search
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    // Duration filter
    if (filterDuration === 'SHORT') return p.durationWeeks <= 4;
    if (filterDuration === 'MEDIUM') return p.durationWeeks >= 5 && p.durationWeeks <= 8;
    if (filterDuration === 'LONG') return p.durationWeeks >= 9;
    return true;
  });

  // Group current week's templates by dayNumber
  const daysGrouped: Record<number, ProgramWeekResponse[]> = {};
  weekData.forEach((item) => {
    if (!daysGrouped[item.dayNumber]) {
      daysGrouped[item.dayNumber] = [];
    }
    daysGrouped[item.dayNumber].push(item);
  });

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case 'POWERLIFTING':
      case 'UNIVERSAL':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/25 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            База 3 в 1
          </span>
        );
      case 'SQUAT':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
            <Flame className="w-3 h-3 text-emerald-400" />
            Приседания
          </span>
        );
      case 'DEADLIFT':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-500/15 text-orange-400 border border-orange-500/25 flex items-center gap-1">
            <Zap className="w-3 h-3 text-orange-400" />
            Становая тяга
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 flex items-center gap-1">
            <Dumbbell className="w-3 h-3 text-indigo-400" />
            Жим лежа
          </span>
        );
    }
  };

  const getExerciseBadge = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('присед') || lower.includes('squat')) {
      return (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Присед
        </span>
      );
    }
    if (lower.includes('тяг') || lower.includes('deadlift')) {
      return (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
          Тяга
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
        Жим
      </span>
    );
  };

  const totalSbd = userSquatOneRm + userBenchOneRm + userDeadliftOneRm;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Программы тренировок
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                База проверенных силовых циклов для жима лёжа, приседаний, становой тяги и троеборья
              </p>
            </div>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-3 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
            <div className="text-right">
              <span className="block text-[11px] text-slate-400">Всего программ в базе</span>
              <span className="text-2xl font-black text-white font-mono">{programs.length}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: PROGRAM SELECTION CATALOG                                         */}
      {/* ========================================================================= */}
      {!selectedProgram ? (
        <div className="space-y-6">
          {/* Movement Category Filter Tabs (ВСЕ / БАЗА 3 В 1 / ЖИМ / ПРИСЕД / ТЯГА) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'ALL' as MovementFilter, label: 'Все программы', count: programs.length, icon: Sparkles },
              { id: 'POWERLIFTING' as MovementFilter, label: 'База 3 в 1 (Троеборье)', count: powerliftingCount, icon: Trophy },
              { id: 'BENCH' as MovementFilter, label: 'Жим лёжа', count: benchCount, icon: Dumbbell },
              { id: 'SQUAT' as MovementFilter, label: 'Приседания', count: squatCount, icon: Flame },
              { id: 'DEADLIFT' as MovementFilter, label: 'Становая тяга', count: deadliftCount, icon: Zap },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedMovement === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedMovement(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span>{tab.label}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar & Duration Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск по названию или автору"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              {[
                { id: 'ALL', label: 'Любая длительность' },
                { id: 'SHORT', label: '4 нед' },
                { id: 'MEDIUM', label: '5-8 нед' },
                { id: 'LONG', label: '9+ нед' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterDuration(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    filterDuration === f.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Program Cards Grid */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-400 text-sm">Загружаем список программ...</p>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="py-16 text-center glass-panel rounded-2xl border border-slate-800">
              <Info className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-300 font-medium">Программы не найдены</p>
              <p className="text-slate-500 text-sm mt-1">Попробуйте изменить поисковый фильтр</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPrograms.map((prog, index) => (
                <div
                  key={prog.id}
                  onClick={() => openProgram(prog)}
                  className="group cursor-pointer glass-panel rounded-2xl p-6 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/10"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        {getCategoryBadge(prog.movementCategory)}
                        <span className="text-xs font-mono font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {prog.durationWeeks}{' '}
                          {prog.durationWeeks === 4
                            ? 'недели'
                            : prog.durationWeeks === 1
                            ? 'неделя'
                            : 'недель'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-600 font-mono">#{index + 1}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                      {prog.name}
                    </h3>

                    <p className="text-slate-400 text-xs sm:text-sm mt-2 line-clamp-3 leading-relaxed">
                      {prog.description || 'Классическая программа силовой специализации.'}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-800/60 flex items-center justify-between text-xs text-indigo-400 font-medium">
                    <span>Открыть план и веса</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW 2: ACTIVE PROGRAM WORKOUT VIEWER                                     */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Prominent Back Button & Breadcrumbs */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={handleBackToList}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold border border-slate-700/80 shadow-md transition flex items-center gap-2 group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-400 group-hover:-translate-x-1 transition-transform" />
              <span>← Назад ко всем программам</span>
            </button>

            <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
              <span className="hover:text-white cursor-pointer" onClick={handleBackToList}>
                Программы
              </span>
              <span>/</span>
              <span className="text-indigo-400 font-bold">{selectedProgram.name}</span>
            </div>
          </div>

          {/* Program Header Card */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                {getCategoryBadge(selectedProgram.movementCategory)}
                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {selectedProgram.durationWeeks} недель
                </span>
                {isPowerliftingProgram(selectedProgram) && (
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Сумма SBD: {totalSbd} кг
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {selectedProgram.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
                {selectedProgram.description}
              </p>
            </div>

            {/* Manual 1RM Input Form & Plate Rounding */}
            <form onSubmit={handleRecalculate} className="flex flex-wrap items-center gap-3">
              {isPowerliftingProgram(selectedProgram) ? (
                /* 3 Inputs for Powerlifting: Squat, Bench, Deadlift */
                <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                  {/* Squat 1RM */}
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80">
                    <span className="text-xs font-bold text-emerald-400">Присед:</span>
                    <input
                      type="number"
                      step="0.5"
                      min="20"
                      max="600"
                      value={userSquatOneRm}
                      onChange={(e) => setUserSquatOneRm(Number(e.target.value))}
                      className="w-16 bg-slate-900 text-white font-mono font-black text-sm px-1.5 py-0.5 rounded border border-slate-700 text-center focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[11px] text-slate-400 font-mono">кг</span>
                  </div>

                  {/* Bench 1RM */}
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80">
                    <span className="text-xs font-bold text-indigo-400">Жим:</span>
                    <input
                      type="number"
                      step="0.5"
                      min="20"
                      max="600"
                      value={userBenchOneRm}
                      onChange={(e) => setUserBenchOneRm(Number(e.target.value))}
                      className="w-16 bg-slate-900 text-white font-mono font-black text-sm px-1.5 py-0.5 rounded border border-slate-700 text-center focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-[11px] text-slate-400 font-mono">кг</span>
                  </div>

                  {/* Deadlift 1RM */}
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80">
                    <span className="text-xs font-bold text-orange-400">Тяга:</span>
                    <input
                      type="number"
                      step="0.5"
                      min="20"
                      max="600"
                      value={userDeadliftOneRm}
                      onChange={(e) => setUserDeadliftOneRm(Number(e.target.value))}
                      className="w-16 bg-slate-900 text-white font-mono font-black text-sm px-1.5 py-0.5 rounded border border-slate-700 text-center focus:outline-none focus:border-orange-500"
                    />
                    <span className="text-[11px] text-slate-400 font-mono">кг</span>
                  </div>
                </div>
              ) : (
                /* Single 1RM input for specialized programs */
                <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400">Ваш 1ПМ:</span>
                  <input
                    type="number"
                    step="0.5"
                    min="20"
                    max="600"
                    value={userOneRm}
                    onChange={(e) => setUserOneRm(Number(e.target.value))}
                    className="w-20 bg-slate-800 text-white font-mono font-black text-base px-2.5 py-1 rounded-lg border border-slate-700 text-center focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-xs font-bold text-slate-400 font-mono">кг</span>
                </div>
              )}

              <label className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={roundToPlates}
                  onChange={(e) => setRoundToPlates(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0 bg-slate-800 border-slate-700"
                />
                <span>До 2.5 кг</span>
              </label>

              <button
                type="submit"
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/25 cursor-pointer"
              >
                Пересчитать
              </button>
            </form>
          </div>

          {/* ===================================================================== */}
          {/* WEEK SELECTOR SLIDER WITH LEFT/RIGHT ARROWS & DRAG SCROLLING          */}
          {/* ===================================================================== */}
          <div className="relative glass-panel rounded-2xl p-3 border border-slate-800">
            <div className="flex items-center gap-2">
              {/* Left Arrow Button */}
              <button
                onClick={() => scrollWeekSlider('left')}
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition flex-shrink-0 cursor-pointer ${
                  canScrollLeft
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                    : 'bg-slate-900/50 border-slate-800/50 text-slate-600'
                }`}
                title="Листать недели влево"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Scrollable Container with Drag and Arrow support (no mouse wheel hijack) */}
              <div
                ref={weekSliderRef}
                onScroll={checkSliderScroll}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                className="flex items-center gap-2.5 overflow-x-auto py-1 px-1 scrollbar-thin select-none cursor-grab active:cursor-grabbing scroll-smooth"
                style={{ scrollbarColor: '#334155 #0f172a' }}
              >
                {Array.from({ length: selectedProgram.durationWeeks }, (_, i) => i + 1).map((week) => (
                  <button
                    key={week}
                    onClick={() => setSelectedWeek(week)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                      selectedWeek === week
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25 scale-[1.04]'
                        : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Неделя {week}
                  </button>
                ))}
              </div>

              {/* Right Arrow Button */}
              <button
                onClick={() => scrollWeekSlider('right')}
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition flex-shrink-0 cursor-pointer ${
                  canScrollRight
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                    : 'bg-slate-900/50 border-slate-800/50 text-slate-600'
                }`}
                title="Листать недели вправо"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Week's Workouts List */}
          {loadingWeek ? (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-400 text-sm">
                Рассчитываем рабочие веса для Недели {selectedWeek}...
              </p>
            </div>
          ) : Object.keys(daysGrouped).length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800">
              <Info className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-300 font-medium">Для этой недели тренировочный шаблон пуст.</p>
              <p className="text-slate-500 text-xs mt-1">Отдых или разгрузка перед новым циклом.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(daysGrouped).map(([dayNum, setsList]) => {
                  const uniqueNames = Array.from(new Set(setsList.map((s) => s.exerciseName))).join(' + ');

                  return (
                    <div
                      key={dayNum}
                      className="glass-panel rounded-2xl border border-slate-800/90 p-5 space-y-4 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-black text-indigo-400 text-sm">
                            Д{dayNum}
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-base">
                              День {dayNum} — {uniqueNames || 'Упражнение'}
                            </h4>
                            <span className="text-[11px] text-slate-400">
                              {setsList.length}{' '}
                              {setsList.length === 1 ? 'упражнение/фаза' : 'подходов/фаз'}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                          ~{setsList[0]?.restSeconds || 120} сек отдых
                        </span>
                      </div>

                      {/* Exercises and Sets in this day */}
                      <div className="space-y-2.5">
                        {setsList.map((st, idx) => {
                          const finalWeight = formatWeight(st.calculatedWeightKg);

                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800/90 bg-slate-900/70 hover:border-slate-750 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-white">
                                      {st.sets}{' '}
                                      {st.sets === 1
                                        ? 'подход'
                                        : st.sets < 5
                                        ? 'подхода'
                                        : 'подходов'}{' '}
                                      × {st.reps}{' '}
                                      {st.reps === 1
                                        ? 'повтор'
                                        : st.reps < 5
                                        ? 'повтора'
                                        : 'повторений'}
                                    </span>
                                    <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                                      {st.intensityPercentage}%
                                    </span>
                                    {getExerciseBadge(st.exerciseName)}
                                  </div>
                                  <span className="text-[11px] text-slate-500">
                                    {st.exerciseName} • Базовый вес: {st.calculatedWeightKg} кг
                                  </span>
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="text-xl font-extrabold text-white font-mono tracking-tight">
                                  {finalWeight}
                                </span>
                                <span className="text-xs text-slate-400 ml-1 font-mono">кг</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Navigation & Back Button */}
              <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                <button
                  onClick={handleBackToList}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold border border-slate-800 transition flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-indigo-400" />
                  <span>← Назад к списку всех программ</span>
                </button>

                <div className="flex items-center gap-2">
                  {selectedWeek > 1 && (
                    <button
                      onClick={() => setSelectedWeek(selectedWeek - 1)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-800 transition cursor-pointer"
                    >
                      ← Неделя {selectedWeek - 1}
                    </button>
                  )}
                  {selectedWeek < selectedProgram.durationWeeks && (
                    <button
                      onClick={() => setSelectedWeek(selectedWeek + 1)}
                      className="px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 rounded-xl text-xs font-semibold border border-indigo-500/30 transition cursor-pointer"
                    >
                      Неделя {selectedWeek + 1} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
