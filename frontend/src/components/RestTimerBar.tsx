import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, RotateCcw, Plus, X, Bell } from 'lucide-react';
import { hardware } from '../services/hardware';

const TIMER_STORAGE_END = 'mslift_rest_timer_end';
const TIMER_STORAGE_INIT = 'mslift_rest_timer_init';
const TIMER_STORAGE_LABEL = 'mslift_rest_timer_label';

export const RestTimerBar: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [initialSeconds, setInitialSeconds] = useState<number>(90);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [exerciseLabel, setExerciseLabel] = useState<string>('');

  const targetEndTimeRef = useRef<number | null>(null);

  // Synchronize / calculate exact remaining seconds from target timestamp
  const syncTimer = useCallback(() => {
    const savedEndStr = localStorage.getItem(TIMER_STORAGE_END);
    if (!savedEndStr) {
      if (isRunning) {
        setIsRunning(false);
        setSecondsLeft(0);
      }
      return;
    }

    const targetEnd = Number(savedEndStr);
    targetEndTimeRef.current = targetEnd;
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((targetEnd - now) / 1000));

    setSecondsLeft(remaining);

    if (remaining <= 0) {
      // Timer finished!
      setIsRunning(false);
      localStorage.removeItem(TIMER_STORAGE_END);
      targetEndTimeRef.current = null;
      hardware.setKeepAwake(false);
      hardware.strongTimerVibrate();
    } else {
      setIsRunning(true);
    }
  }, [isRunning]);

  // Check saved timer on initial mount
  useEffect(() => {
    const savedEnd = localStorage.getItem(TIMER_STORAGE_END);
    const savedInit = localStorage.getItem(TIMER_STORAGE_INIT);
    const savedLabel = localStorage.getItem(TIMER_STORAGE_LABEL);

    if (savedInit) {
      setInitialSeconds(Number(savedInit) || 90);
    }
    if (savedLabel) {
      setExerciseLabel(savedLabel);
    }

    if (savedEnd) {
      const remaining = Math.max(0, Math.ceil((Number(savedEnd) - Date.now()) / 1000));
      if (remaining > 0) {
        setSecondsLeft(remaining);
        setIsRunning(true);
        targetEndTimeRef.current = Number(savedEnd);
        hardware.setKeepAwake(true);
      } else {
        localStorage.removeItem(TIMER_STORAGE_END);
      }
    }
  }, []);

  // Interval ticker + lifecycle listeners (visibilitychange, focus, pageshow)
  useEffect(() => {
    if (!isRunning) return;

    // Fast ticker (250ms) for smooth and responsive UI updates
    const interval = setInterval(() => {
      syncTimer();
    }, 250);

    // CRITICAL: When the screen turns back on or the user returns from another app,
    // immediately recalculate remaining time based on current Date.now()
    const handleVisibility = () => {
      syncTimer();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);
    window.addEventListener('pageshow', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
      window.removeEventListener('pageshow', handleVisibility);
    };
  }, [isRunning, syncTimer]);

  // Listen to global timer trigger (e.g. from Workout Diary when a set is checked)
  useEffect(() => {
    const handleGlobalTimer = (e: any) => {
      const { seconds, exerciseName } = e.detail || {};
      if (seconds && seconds > 0) {
        startTimer(seconds, exerciseName);
      }
    };

    window.addEventListener('mslift:start-rest-timer', handleGlobalTimer);
    return () => {
      window.removeEventListener('mslift:start-rest-timer', handleGlobalTimer);
    };
  }, []);

  const startTimer = async (sec: number, label?: string) => {
    hardware.haptic('medium');
    const targetEnd = Date.now() + sec * 1000;
    targetEndTimeRef.current = targetEnd;

    setInitialSeconds(sec);
    setSecondsLeft(sec);
    setIsRunning(true);
    setIsOpen(true);
    const resolvedLabel = label || 'MSLift';
    setExerciseLabel(resolvedLabel);

    localStorage.setItem(TIMER_STORAGE_END, String(targetEnd));
    localStorage.setItem(TIMER_STORAGE_INIT, String(sec));
    localStorage.setItem(TIMER_STORAGE_LABEL, resolvedLabel);

    await hardware.setKeepAwake(true);
    await hardware.scheduleRestTimer(sec, resolvedLabel);
  };

  const addTime = async (extraSeconds: number) => {
    hardware.haptic('light');
    const now = Date.now();
    const currentRemaining = targetEndTimeRef.current
      ? Math.max(0, Math.ceil((targetEndTimeRef.current - now) / 1000))
      : secondsLeft;

    const newSeconds = currentRemaining + extraSeconds;
    const newTarget = now + newSeconds * 1000;
    targetEndTimeRef.current = newTarget;

    setInitialSeconds((prev) => Math.max(prev, newSeconds));
    setSecondsLeft(newSeconds);
    setIsRunning(true);

    localStorage.setItem(TIMER_STORAGE_END, String(newTarget));
    localStorage.setItem(TIMER_STORAGE_INIT, String(Math.max(initialSeconds, newSeconds)));

    await hardware.setKeepAwake(true);
    await hardware.scheduleRestTimer(newSeconds, exerciseLabel || 'MSLift');
  };

  const stopTimer = async () => {
    hardware.haptic('light');
    setIsRunning(false);
    setSecondsLeft(0);
    targetEndTimeRef.current = null;

    localStorage.removeItem(TIMER_STORAGE_END);
    localStorage.removeItem(TIMER_STORAGE_INIT);
    localStorage.removeItem(TIMER_STORAGE_LABEL);

    await hardware.setKeepAwake(false);
    await hardware.cancelRestTimer();
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress percentage (0 to 100%)
  const progress = initialSeconds > 0
    ? Math.min(100, Math.max(0, ((initialSeconds - secondsLeft) / initialSeconds) * 100))
    : 0;

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

          {exerciseLabel && exerciseLabel !== 'MSLift' && (
            <div className="text-[11px] font-semibold text-indigo-300 truncate">
              {exerciseLabel}
            </div>
          )}

          {/* Time display & progress */}
          <div className="relative py-2.5 text-center bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-indigo-600/25 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
            <span className="relative z-10 text-3xl font-black font-mono tracking-wider text-white">
              {formatTime(secondsLeft)}
            </span>
            <span className="block text-[10px] text-slate-400 relative z-10 mt-0.5 flex items-center justify-center gap-1">
              {isRunning ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>Отсчёт отдыха (активен в фоне)</span>
                </>
              ) : (
                'Таймер на паузе / завершен'
              )}
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
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
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
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl shadow-xl transition-all border cursor-pointer ${
            isRunning
              ? 'bg-indigo-600 text-white border-indigo-400/50 shadow-indigo-600/40 animate-pulse'
              : 'bg-slate-950/90 text-slate-200 border-slate-800 hover:border-indigo-500/50 backdrop-blur-md'
          }`}
        >
          <Timer className={`w-4 h-4 ${isRunning ? 'animate-spin text-white' : 'text-indigo-400'}`} />
          {isRunning ? (
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-black text-sm">{formatTime(secondsLeft)}</span>
              <Bell className="w-3 h-3 text-indigo-200 animate-bounce" />
            </div>
          ) : (
            <span className="text-xs font-bold">⏱ Отдых</span>
          )}
        </button>
      )}
    </div>
  );
};
