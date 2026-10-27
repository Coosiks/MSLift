-- Справочник тренировочных программ
CREATE TABLE training_program (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    duration_weeks INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Шаблоны тренировок внутри программы
CREATE TABLE program_workout_template (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES training_program(id) ON DELETE CASCADE,
    week_number INT NOT NULL,
    day_number INT NOT NULL,
    exercise_id UUID NOT NULL REFERENCES exercise(id),
    sets INT NOT NULL,
    reps INT NOT NULL,
    intensity_percentage DECIMAL(5, 2) NOT NULL,
    rest_seconds INT DEFAULT 120
);

-- Добавляем ПРАВИЛЬНЫЙ Smolov Jr. (3 недели прогрессии + 1 неделя пик)
INSERT INTO training_program (name, description, duration_weeks) VALUES 
('Smolov Jr.', 'Высокоинтенсивная программа специализации на жиме лежа. 4 тренировки в неделю.', 4);

-- Неделя 1: Базовая
INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds)
SELECT (SELECT id FROM training_program WHERE name = 'Smolov Jr.'), 1, 1, (SELECT id FROM exercise WHERE name = 'Жим лежа'), 6, 6, 70.00, 120;

INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds)
SELECT (SELECT id FROM training_program WHERE name = 'Smolov Jr.'), 1, 2, (SELECT id FROM exercise WHERE name = 'Жим лежа'), 7, 5, 75.00, 120;

INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds)
SELECT (SELECT id FROM training_program WHERE name = 'Smolov Jr.'), 1, 3, (SELECT id FROM exercise WHERE name = 'Жим лежа'), 8, 4, 80.00, 120;

INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds)
SELECT (SELECT id FROM training_program WHERE name = 'Smolov Jr.'), 1, 4, (SELECT id FROM exercise WHERE name = 'Жим лежа'), 10, 3, 85.00, 180;

-- Неделя 2: +2.5% к интенсивности
INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds)
SELECT (SELECT id FROM training_program WHERE name = 'Smolov Jr.'), 2, 1, (SELECT id FROM exercise WHERE name = 'Жим лежа'), 6, 6, 72.50, 120;

INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds)
SELECT (SELECT id FROM training_program WHERE name = 'Smolov Jr.'), 2, 2, (SELECT id FROM exercise WHERE name = 'Жим лежа'), 7, 5, 77.50, 120;

INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds)
SELECT (SELECT id FROM training_program WHERE name = 'Smolov Jr.'), 2, 3, (SELECT id FROM exercise WHERE name = 'Жим лежа'), 8, 4, 82.50, 120;

INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds)
SELECT (SELECT id FROM training_program WHERE name = 'Smolov Jr.'), 2, 4, (SELECT id FROM exercise WHERE name = 'Жим лежа'), 10, 3, 87.50, 180;

-- Неделя 3: +5% к интенсивности
INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds)
SELECT (SELECT id FROM training_program WHERE name = 'Smolov Jr.'), 3, 1, (SELECT id FROM exercise WHERE name = 'Жим лежа'), 6, 6, 75.00, 120;

INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds)
SELECT (SELECT id FROM training_program WHERE name = 'Smolov Jr.'), 3, 2, (SELECT id FROM exercise WHERE name = 'Жим лежа'), 7, 5, 80.00, 120;

INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds)
SELECT (SELECT id FROM training_program WHERE name = 'Smolov Jr.'), 3, 3, (SELECT id FROM exercise WHERE name = 'Жим лежа'), 8, 4, 85.00, 120;

INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds)
SELECT (SELECT id FROM training_program WHERE name = 'Smolov Jr.'), 3, 4, (SELECT id FROM exercise WHERE name = 'Жим лежа'), 10, 3, 90.00, 180;

-- Неделя 4: Пик (тест нового 1ПМ)
INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds)
SELECT (SELECT id FROM training_program WHERE name = 'Smolov Jr.'), 4, 1, (SELECT id FROM exercise WHERE name = 'Жим лежа'), 1, 1, 100.00, 300;