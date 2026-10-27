import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Programs } from './pages/Programs';
import { WorkoutDiary } from './pages/WorkoutDiary';
import { Calculator } from './pages/Calculator';
import { Nutrition } from './pages/Nutrition';
import { NutritionCalculator } from './pages/NutritionCalculator';

export function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-200">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
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

        <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
            <span className="font-semibold text-slate-400">
              MSLift
            </span>
          </div>
        </footer>
      </div>
    </Router>
  </ThemeProvider>
  );
}

export default App;