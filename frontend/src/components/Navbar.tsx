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
  Moon
} from 'lucide-react';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    // Check backend connection
    api.getPrograms()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

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

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendOnline === true
                    ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse'
                    : backendOnline === false
                    ? 'bg-rose-400'
                    : 'bg-amber-400'
                }`}
              />
              <span className="text-slate-400 font-mono text-[11px]">
                {backendOnline === true
                  ? 'Сервер :8080 онлайн'
                  : backendOnline === false
                  ? 'Сервер оффлайн'
                  : 'Подключение...'}
              </span>
            </div>
          </div>

          {/* Mobile menu and theme buttons */}
          <div className="flex md:hidden items-center gap-1.5">
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
