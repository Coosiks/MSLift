-- Таблица справочника упражнений
CREATE TABLE exercise (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    muscle_group VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица записей подходов (дневник тренировок)
CREATE TABLE workout_set (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exercise_id UUID NOT NULL REFERENCES exercise(id) ON DELETE CASCADE,
    weight_kg DECIMAL(6, 2) NOT NULL,
    reps INT NOT NULL,
    rpe INT CHECK (rpe >= 1 AND rpe <= 10), -- Рейтинг воспринимаемого усилия (1-10)
    workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индекс для быстрого поиска истории по упражнению
CREATE INDEX idx_workout_set_exercise_id ON workout_set(exercise_id);

-- Добавим базовое упражнение для старта
INSERT INTO exercise (name, muscle_group) VALUES 
('Жим лежа', 'Грудь'),
('Приседания', 'Ноги'),
('Становая тяга', 'Спина');
