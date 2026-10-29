import React, { useState, useEffect, useRef } from 'react';
import { Timer, RotateCcw, Plus, X } from 'lucide-react';
import { hardware } from '../services/hardware';

export const RestTimerBar: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [initialSeconds, setInitialSeconds] = useState<number>(90);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setTimeout(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      setIsRunning(false);
      // Таймер завершился
      hardware.haptic('heavy');
      // Второе вибро через 400мс
      setTimeout(() => hardware.haptic('heavy'), 400);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, secondsLeft]);

  const startTimer = async (sec: number) => {
    hardware.haptic('medium');
    setInitialSeconds(sec);
    setSecondsLeft(sec);
    setIsRunning(true);
    setIsOpen(true);
    await hardware.scheduleRestTimer(sec, 'MSLift');
  };

  const addTime = async (extraSeconds: number) => {
    hardware.haptic('light');
    const newTime = secondsLeft + extraSeconds;
    setSecondsLeft(newTime);
    if (!isRunning) setIsRunning(true);
    await hardware.scheduleRestTimer(newTime, 'MSLift');
  };

  const stopTimer = async () => {
    hardware.haptic('light');
    setIsRunning(false);
    setSecondsLeft(0);
    await hardware.cancelRestTimer();
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const progress = initialSeconds > 0 ? ((initialSeconds - secondsLeft) / initialSeconds) * 100 : 0;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
      {/* Floating expanded control panel */}
      {isOpen ? (
        <div className="glass-panel bg-slate-950/95 border border-indigo-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl w-72 space-y-3 animate-in fade-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Таймер отдыха
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Time display & progress */}
          <div className="relative py-2 text-center bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-indigo-600/20 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
            <span className="relative z-10 text-3xl font-black font-mono tracking-wider text-white">
              {formatTime(secondsLeft)}
            </span>
            <span className="block text-[10px] text-slate-400 relative z-10">
              {isRunning ? 'Идет отсчет отдыха...' : 'Таймер на паузе / завершен'}
            </span>
          </div>

          {/* Quick preset buttons */}
          <div className="grid grid-cols-4 gap-1.5">
            {[60, 90, 120, 180].map((sec) => (
              <button
                key={sec}
                onClick={() => startTimer(sec)}
                className={`py-1.5 rounded-lg text-xs font-mono font-bold transition border cursor-pointer ${
                  initialSeconds === sec && isRunning
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {sec}с
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
            <button
              onClick={() => addTime(30)}
              className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> +30с
            </button>
            <button
              onClick={stopTimer}
              className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Сброс
            </button>
          </div>
        </div>
      ) : (
        /* Minimized floating button */
        <button
          onClick={() => {
            hardware.haptic('light');
            setIsOpen(true);
          }}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-xl transition-all border cursor-pointer ${
            isRunning
              ? 'bg-indigo-600 text-white border-indigo-400/50 shadow-indigo-600/40 animate-pulse'
              : 'bg-slate-950/90 text-slate-200 border-slate-800 hover:border-indigo-500/50 backdrop-blur-md'
          }`}
        >
          <Timer className={`w-4 h-4 ${isRunning ? 'animate-spin' : 'text-indigo-400'}`} />
          {isRunning ? (
            <span className="font-mono font-black text-sm">{formatTime(secondsLeft)}</span>
          ) : (
            <span className="text-xs font-bold">⏱ Отдых</span>
          )}
        </button>
      )}
    </div>
  );
};
