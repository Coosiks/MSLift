import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Flame,
  Dumbbell,
  Calculator,
  Apple
} from 'lucide-react';
import { hardware } from '../services/hardware';

export const BottomNav: React.FC = () => {
  const tabs = [
    { to: '/', label: 'Дашборд', icon: LayoutDashboard },
    { to: '/programs', label: 'Программы', icon: Flame },
    { to: '/workouts', label: 'Дневник', icon: Dumbbell },
    { to: '/calculator', label: '1ПМ', icon: Calculator },
    { to: '/nutrition', label: 'КБЖУ', icon: Apple },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-xl px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              onClick={() => hardware.haptic('light')}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-indigo-400 font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-lg transition-all ${
                      isActive ? 'bg-indigo-600/20 text-indigo-400' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
