import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Dumbbell,
  Calculator,
  Apple,
  LayoutDashboard,
  Menu,
  X,
  Flame,
  Target,
  Sun,
  Moon,
  Wifi,
  WifiOff
} from 'lucide-react';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { hardware } from '../services/hardware';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [offlineMode, setOfflineModeState] = useState<boolean>(() => storage.isOfflineMode());

  const handleToggleOffline = () => {
    hardware.haptic('medium');
    const nextVal = !offlineMode;
    storage.setOfflineMode(nextVal);
    setOfflineModeState(nextVal);
  };

  useEffect(() => {
    if (offlineMode) {
      setBackendOnline(false);
      return;
    }
    // Check backend connection
    api.getPrograms()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, [offlineMode]);

  const navItems: { to: string; label: string; icon: any; badge?: string }[] = [
    { to: '/', label: 'Дашборд', icon: LayoutDashboard },
    { to: '/programs', label: 'Программы', icon: Flame },
    { to: '/workouts', label: 'Дневник', icon: Dumbbell },
    { to: '/calculator', label: '1ПМ', icon: Calculator },
    { to: '/nutrition', label: 'Дневник КБЖУ', icon: Apple },
    { to: '/nutrition-calculator', label: 'Норма КБЖУ', icon: Target },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <NavLink to="/" className="flex items-center group py-1">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-indigo-300 transition-all">
                  MS<span className="text-indigo-400">Lift</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none mt-0.5">Система тренировок и силы</p>
            </div>
          </NavLink>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Status Indicator & Theme Toggle */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
              title={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
              className="flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-400/40 hover:bg-slate-800/60 transition-all shadow-sm group cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Offline / Online Mode Toggle Button */}
            <button
              onClick={handleToggleOffline}
              title="Нажмите для переключения режима Оффлайн/Онлайн"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition cursor-pointer ${
                offlineMode
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                  : backendOnline === true
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  offlineMode
                    ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                    : backendOnline === true
                    ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse'
                    : 'bg-rose-400'
                }`}
              />
              <span className="font-mono text-[11px] font-bold">
                {offlineMode
                  ? '⚡ Зал (Оффлайн)'
                  : backendOnline === true
                  ? 'Сервер :8080'
                  : 'Оффлайн авто'}
              </span>
            </button>
          </div>

          {/* Mobile menu, offline, and theme buttons */}
          <div className="flex md:hidden items-center gap-1.5">
            {/* Quick mobile offline button */}
            <button
              onClick={handleToggleOffline}
              aria-label="Переключить режим оффлайн"
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                offlineMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {offlineMode ? <WifiOff className="w-3 h-3 text-amber-400" /> : <Wifi className="w-3 h-3 text-emerald-400" />}
              <span>{offlineMode ? 'Оффлайн' : 'Онлайн'}</span>
            </button>

            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
              className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-400" />
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="Меню"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-3 pb-5 space-y-1 backdrop-blur-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-base font-medium transition ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-indigo-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500 text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={() => {
                toggleTheme();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-400" />
                )}
                <span>Тема оформления</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                {theme === 'dark' ? 'Тёмная' : 'Светлая'}
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
