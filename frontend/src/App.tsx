import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Programs } from './pages/Programs';
import { WorkoutDiary } from './pages/WorkoutDiary';
import { Calculator } from './pages/Calculator';
import { Nutrition } from './pages/Nutrition';
import { NutritionCalculator } from './pages/NutritionCalculator';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

import { BottomNav } from './components/BottomNav';
import { RestTimerBar } from './components/RestTimerBar';

export function App() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(() => {
    return localStorage.getItem('mslift_disclaimer_accepted') === 'true';
  });

  const handleAcceptDisclaimer = () => {
    localStorage.setItem('mslift_disclaimer_accepted', 'true');
    setDisclaimerAccepted(true);
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-200">
          <Navbar />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 md:pb-10">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/workouts" element={<WorkoutDiary />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/nutrition-calculator" element={<NutritionCalculator />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <RestTimerBar />
          <BottomNav />

          {/* First launch / Legal safety disclaimer banner */}
          {!disclaimerAccepted && (
            <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xl z-50 animate-in fade-in slide-in-from-bottom duration-300">
              <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-amber-500/40 shadow-2xl bg-slate-950/95 backdrop-blur-xl space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      Важное предупреждение
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Все тренировочные планы, расчёты рабочих весов (1ПМ) и норм КБЖУ носят исключительно рекомендательный характер. Работа с большими весами в пауэрлифтинге травмоопасна. Приложение не заменяет консультацию спортивного врача и контроль тренера. Нажимая «Продолжить», вы подтверждаете отсутствие медицинских противопоказаний и берёте полную ответственность за своё здоровье на себя.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
                  <button
                    onClick={handleAcceptDisclaimer}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/25 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Продолжить
                  </button>
                </div>
              </div>
            </div>
          )}

          <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="font-bold text-slate-300 text-sm">
                  MSLift <span className="font-normal text-slate-500 text-xs">· Powerlifting & Strength Ecosystem</span>
                </div>
                <p className="text-[11px] text-slate-400 max-w-2xl leading-relaxed">
                  ⚠️ <strong>Медицинский отказ:</strong> тренировочные планы, формулы 1ПМ и расчеты КБЖУ носят ознакомительный характер. Всегда консультируйтесь с врачом перед началом высокоинтенсивных силовых тренировок.
                </p>
              </div>
              <div className="pt-2 sm:pt-0 text-center sm:text-right shrink-0">
                <span className="text-[11px] text-slate-400 block">
                  © 2026 <a href="https://github.com/Coosiks" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Coosiks</a>. All Rights Reserved.
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Proprietary Software
                </span>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;