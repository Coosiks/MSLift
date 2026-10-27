-- =========================================================================
-- V9: ТАБЛИЦА ЗАПИСЕЙ ДНЕВНИКА ТРЕНИРОВОК (ПРОГРАММА + ПОДСОБНЫЕ УПРАЖНЕНИЯ)
-- =========================================================================

CREATE TABLE IF NOT EXISTS training_diary_entry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES training_program(id) ON DELETE SET NULL,
    program_name VARCHAR(255) NOT NULL,
    week_number INT NOT NULL,
    day_number INT NOT NULL,
    workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
    base_exercises TEXT NOT NULL,
    accessory_exercises TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diary_workout_date ON training_diary_entry(workout_date DESC);
