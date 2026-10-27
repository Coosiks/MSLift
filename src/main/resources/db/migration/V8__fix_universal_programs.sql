-- =========================================================================
-- V8: ИСПРАВЛЕНИЕ ПРОГРАММ «БАЗА 3 В 1» (ТРОЕБОРЬЕ) И УДАЛЕНИЕ ДУБЛИКАТОВ
-- =========================================================================

-- 1. Удаление неполных дубликатов из V6 (где отсутствовал жим лежа)
DELETE FROM training_program WHERE name = 'Метод Куба (The Cube Method)';
DELETE FROM training_program WHERE name = '6-недельный цикл Кэндито (Candito)';
DELETE FROM training_program WHERE name = '5/3/1 Джима Вендлера (Присед и Тяга)';

-- 2. Переименование полных соревновательных циклов в канонические имена
UPDATE training_program 
SET name = 'Метод Куба (The Cube Method)' 
WHERE name = 'Метод Куба (The Cube Method — Троеборье)';

UPDATE training_program 
SET name = 'Candito 6 Week Strength Program (6 недель Кэндито)' 
WHERE name = 'Candito 6 Week Strength Program (Троеборье)';

-- 3. Добавление жима лежа и полноценной структуры для «Линейный цикл В. С. Степанова»
DO $$
DECLARE
    bench_id UUID;
    squat_id UUID;
    deadlift_id UUID;
    stepanov_id UUID;
BEGIN
    SELECT id INTO bench_id FROM exercise WHERE name = 'Жим лежа';
    SELECT id INTO squat_id FROM exercise WHERE name = 'Приседания';
    SELECT id INTO deadlift_id FROM exercise WHERE name = 'Становая тяга';
    SELECT id INTO stepanov_id FROM training_program WHERE name = 'Линейный цикл В. С. Степанова';

    IF stepanov_id IS NOT NULL AND bench_id IS NOT NULL AND squat_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        -- Удаляем старые шаблоны (где не было жима)
        DELETE FROM program_workout_template WHERE program_id = stepanov_id;

        -- Недели 1-8: День 1 Присед, День 2 Жим лежа, День 3 Становая тяга
        -- W1 (4x6 @ 70%)
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (stepanov_id, 1, 1, squat_id, 4, 6, 70.0, 180),
        (stepanov_id, 1, 2, bench_id, 4, 6, 70.0, 150),
        (stepanov_id, 1, 3, deadlift_id, 4, 6, 70.0, 210);

        -- W2 (4x5 @ 75%)
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (stepanov_id, 2, 1, squat_id, 4, 5, 75.0, 180),
        (stepanov_id, 2, 2, bench_id, 4, 5, 75.0, 150),
        (stepanov_id, 2, 3, deadlift_id, 4, 5, 75.0, 210);

        -- W3 (4x4 @ 80%)
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (stepanov_id, 3, 1, squat_id, 4, 4, 80.0, 180),
        (stepanov_id, 3, 2, bench_id, 4, 4, 80.0, 150),
        (stepanov_id, 3, 3, deadlift_id, 4, 4, 80.0, 210);

        -- W4 (3x3 @ 85%)
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (stepanov_id, 4, 1, squat_id, 3, 3, 85.0, 210),
        (stepanov_id, 4, 2, bench_id, 3, 3, 85.0, 180),
        (stepanov_id, 4, 3, deadlift_id, 3, 3, 85.0, 240);

        -- W5 (3x3 @ 87.5%)
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (stepanov_id, 5, 1, squat_id, 3, 3, 87.5, 210),
        (stepanov_id, 5, 2, bench_id, 3, 3, 87.5, 180),
        (stepanov_id, 5, 3, deadlift_id, 3, 3, 87.5, 240);

        -- W6 (2x2 @ 92.5%)
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (stepanov_id, 6, 1, squat_id, 2, 2, 92.5, 240),
        (stepanov_id, 6, 2, bench_id, 2, 2, 92.5, 210),
        (stepanov_id, 6, 3, deadlift_id, 2, 2, 92.5, 270);

        -- W7 (2x1 @ 97.5%)
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (stepanov_id, 7, 1, squat_id, 2, 1, 97.5, 270),
        (stepanov_id, 7, 2, bench_id, 2, 1, 97.5, 240),
        (stepanov_id, 7, 3, deadlift_id, 2, 1, 97.5, 300);

        -- W8 (1x1 @ 102.5% проходка)
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (stepanov_id, 8, 1, squat_id, 1, 1, 102.5, 300),
        (stepanov_id, 8, 2, bench_id, 1, 1, 102.5, 270),
        (stepanov_id, 8, 3, deadlift_id, 1, 1, 102.5, 300);
    END IF;
END $$;

-- 4. Перевод всех универсальных программ в категорию POWERLIFTING (База 3 в 1: присед, жим, тяга)
UPDATE training_program 
SET movement_category = 'POWERLIFTING' 
WHERE movement_category = 'UNIVERSAL';
