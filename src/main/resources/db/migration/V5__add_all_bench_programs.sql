-- Исправляем ограничение NOT NULL для user_id в таблицах дневника, чтобы приложение работало без обязательной авторизации
ALTER TABLE workout_set ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE nutrition_entry ALTER COLUMN user_id DROP NOT NULL;

-- Добавляем все программы по жиму лежа из приложения 'Твой жим'

-- 1. 16 недель Бутенко
INSERT INTO training_program (name, description, duration_weeks) VALUES
('16 недель Бутенко', 'Классический 16-недельный силовой цикл Виктора Бутенко для жима лежа. Плавная периодизация от объемной работы к пиковой силе. 2 тренировки в неделю (тяжелая и восстановительная).', 16)
ON CONFLICT (name) DO NOTHING;

-- 2. 5/3/1 Дж. Вендлера
INSERT INTO training_program (name, description, duration_weeks) VALUES
('5/3/1 Дж. Вендлера', 'Знаменитая система Джима Вендлера. 4-недельный цикл: неделя 3х5, неделя 3х3, неделя 5/3/1 (выход на максимум с повторениями) и разгрузочная неделя.', 4)
ON CONFLICT (name) DO NOTHING;

-- 3. План Б.И. Шейко
INSERT INTO training_program (name, description, duration_weeks) VALUES
('План Б.И. Шейко', 'Программа заслуженного тренера России Б.И. Шейко. Высокообъемная волновая нагрузка с несколькими пиками интенсивности в неделю.', 4)
ON CONFLICT (name) DO NOTHING;

-- 4. Жим по Т. Арсиди
INSERT INTO training_program (name, description, duration_weeks) VALUES
('Жим по Т. Арсиди', '8-недельная программа легендарного американского жимовика Теда Арсиди (первый человек, официально пожавший 320 кг). Линейная прогрессия от 8 к 1 повторению.', 8)
ON CONFLICT (name) DO NOTHING;

-- 5. Жим по Р. Уэйлу
INSERT INTO training_program (name, description, duration_weeks) VALUES
('Жим по Р. Уэйлу', '12-недельная программа Рика Уэйла (рекордсмен мира в жиме лежа). Тщательно выверенный цикл с переходом от гипертрофии (10 повт.) к синглам.', 12)
ON CONFLICT (name) DO NOTHING;

-- 6. Пиковый цикл Верхошанского
INSERT INTO training_program (name, description, duration_weeks) VALUES
('Пиковый цикл Верхошанского', '6-недельный пиковый цикл профессора Ю.В. Верхошанского. Построен на сочетании субмаксимальных нагрузок и скоростно-силовой работы.', 6)
ON CONFLICT (name) DO NOTHING;

-- 7. Жим по Муравьеву
INSERT INTO training_program (name, description, duration_weeks) VALUES
('Жим по Муравьеву', '8-недельная прогрессивная методика жима лежа В.Л. Муравьева. От 4х6 до финального рекорда.', 8)
ON CONFLICT (name) DO NOTHING;

-- 8. Суровецкий. Система Стандарт
INSERT INTO training_program (name, description, duration_weeks) VALUES
('Суровецкий. Система Стандарт', '6-недельная классическая система А. Суровецкого для преодоления жимового плато.', 6)
ON CONFLICT (name) DO NOTHING;

-- 9. Суровецкий. Программа N1
INSERT INTO training_program (name, description, duration_weeks) VALUES
('Суровецкий. Программа N1', '5-недельный ударный микроцикл Суровецкого. Высокая плотность весов 80-95% с выходом на пик.', 5)
ON CONFLICT (name) DO NOTHING;

-- 10. Суровецкий. Программа N2
INSERT INTO training_program (name, description, duration_weeks) VALUES
('Суровецкий. Программа N2', '7-недельный углубленный цикл Суровецкого для атлетов среднего и продвинутого уровня.', 7)
ON CONFLICT (name) DO NOTHING;


-- ==================== ЗАПОЛНЕНИЕ ШАБЛОНОВ ТРЕНИРОВОК ====================

-- 1. Бутенко (16 недель, 2 дня в неделю)
DO $$
DECLARE
    prog_id UUID;
    bench_id UUID;
BEGIN
    SELECT id INTO prog_id FROM training_program WHERE name = '16 недель Бутенко';
    SELECT id INTO bench_id FROM exercise WHERE name = 'Жим лежа';
    
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL THEN
        -- W1
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, bench_id, 5, 5, 70.0, 120),
        (prog_id, 1, 2, bench_id, 4, 4, 60.0, 90),
        -- W2
        (prog_id, 2, 1, bench_id, 5, 5, 72.5, 120),
        (prog_id, 2, 2, bench_id, 4, 4, 60.0, 90),
        -- W3
        (prog_id, 3, 1, bench_id, 5, 5, 75.0, 150),
        (prog_id, 3, 2, bench_id, 4, 4, 65.0, 90),
        -- W4
        (prog_id, 4, 1, bench_id, 5, 5, 77.5, 150),
        (prog_id, 4, 2, bench_id, 4, 4, 65.0, 90),
        -- W5
        (prog_id, 5, 1, bench_id, 4, 4, 80.0, 150),
        (prog_id, 5, 2, bench_id, 4, 4, 65.0, 90),
        -- W6
        (prog_id, 6, 1, bench_id, 4, 4, 82.5, 180),
        (prog_id, 6, 2, bench_id, 4, 4, 70.0, 90),
        -- W7
        (prog_id, 7, 1, bench_id, 4, 4, 85.0, 180),
        (prog_id, 7, 2, bench_id, 4, 4, 70.0, 90),
        -- W8
        (prog_id, 8, 1, bench_id, 3, 3, 87.5, 180),
        (prog_id, 8, 2, bench_id, 4, 4, 70.0, 90),
        -- W9
        (prog_id, 9, 1, bench_id, 3, 3, 90.0, 180),
        (prog_id, 9, 2, bench_id, 3, 3, 75.0, 90),
        -- W10
        (prog_id, 10, 1, bench_id, 3, 3, 92.5, 210),
        (prog_id, 10, 2, bench_id, 3, 3, 75.0, 90),
        -- W11
        (prog_id, 11, 1, bench_id, 3, 2, 95.0, 210),
        (prog_id, 11, 2, bench_id, 3, 3, 75.0, 90),
        -- W12
        (prog_id, 12, 1, bench_id, 2, 2, 97.5, 210),
        (prog_id, 12, 2, bench_id, 3, 3, 70.0, 90),
        -- W13
        (prog_id, 13, 1, bench_id, 2, 1, 100.0, 240),
        (prog_id, 13, 2, bench_id, 3, 3, 70.0, 90),
        -- W14
        (prog_id, 14, 1, bench_id, 2, 1, 102.5, 240),
        (prog_id, 14, 2, bench_id, 3, 3, 65.0, 90),
        -- W15
        (prog_id, 15, 1, bench_id, 2, 1, 105.0, 240),
        (prog_id, 15, 2, bench_id, 2, 2, 60.0, 90),
        -- W16 (Выход на пик и рекорд)
        (prog_id, 16, 1, bench_id, 1, 1, 107.5, 300),
        (prog_id, 16, 2, bench_id, 1, 1, 110.0, 300);
    END IF;
END $$;

-- 2. 5/3/1 Дж. Вендлера (4 недели)
DO $$
DECLARE
    prog_id UUID;
    bench_id UUID;
BEGIN
    SELECT id INTO prog_id FROM training_program WHERE name = '5/3/1 Дж. Вендлера';
    SELECT id INTO bench_id FROM exercise WHERE name = 'Жим лежа';
    
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL THEN
        -- Неделя 1 (3x5)
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, bench_id, 1, 5, 65.0, 120),
        (prog_id, 1, 1, bench_id, 1, 5, 75.0, 150),
        (prog_id, 1, 1, bench_id, 1, 5, 85.0, 180),
        -- Неделя 2 (3x3)
        (prog_id, 2, 1, bench_id, 1, 3, 70.0, 120),
        (prog_id, 2, 1, bench_id, 1, 3, 80.0, 150),
        (prog_id, 2, 1, bench_id, 1, 3, 90.0, 180),
        -- Неделя 3 (5/3/1)
        (prog_id, 3, 1, bench_id, 1, 5, 75.0, 150),
        (prog_id, 3, 1, bench_id, 1, 3, 85.0, 180),
        (prog_id, 3, 1, bench_id, 1, 1, 95.0, 240),
        -- Неделя 4 (Deload)
        (prog_id, 4, 1, bench_id, 1, 5, 40.0, 90),
        (prog_id, 4, 1, bench_id, 1, 5, 50.0, 90),
        (prog_id, 4, 1, bench_id, 1, 5, 60.0, 90);
    END IF;
END $$;

-- 3. План Б.И. Шейко (4 недели, 3 дня в неделю)
DO $$
DECLARE
    prog_id UUID;
    bench_id UUID;
BEGIN
    SELECT id INTO prog_id FROM training_program WHERE name = 'План Б.И. Шейко';
    SELECT id INTO bench_id FROM exercise WHERE name = 'Жим лежа';
    
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL THEN
        -- W1
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, bench_id, 5, 3, 70.0, 120),
        (prog_id, 1, 2, bench_id, 5, 3, 75.0, 120),
        (prog_id, 1, 3, bench_id, 5, 2, 80.0, 150),
        -- W2
        (prog_id, 2, 1, bench_id, 5, 3, 75.0, 120),
        (prog_id, 2, 2, bench_id, 6, 2, 80.0, 150),
        (prog_id, 2, 3, bench_id, 5, 3, 80.0, 150),
        -- W3
        (prog_id, 3, 1, bench_id, 5, 2, 80.0, 150),
        (prog_id, 3, 2, bench_id, 5, 2, 85.0, 180),
        (prog_id, 3, 3, bench_id, 4, 2, 85.0, 180),
        -- W4
        (prog_id, 4, 1, bench_id, 3, 2, 85.0, 150),
        (prog_id, 4, 2, bench_id, 3, 1, 90.0, 180),
        (prog_id, 4, 3, bench_id, 1, 1, 102.5, 240);
    END IF;
END $$;

-- 4. Жим по Т. Арсиди (8 недель)
DO $$
DECLARE
    prog_id UUID;
    bench_id UUID;
BEGIN
    SELECT id INTO prog_id FROM training_program WHERE name = 'Жим по Т. Арсиди';
    SELECT id INTO bench_id FROM exercise WHERE name = 'Жим лежа';
    
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, bench_id, 3, 8, 70.0, 120),
        (prog_id, 2, 1, bench_id, 3, 8, 72.5, 120),
        (prog_id, 3, 1, bench_id, 3, 5, 77.5, 150),
        (prog_id, 4, 1, bench_id, 3, 5, 82.5, 150),
        (prog_id, 5, 1, bench_id, 3, 3, 87.5, 180),
        (prog_id, 6, 1, bench_id, 3, 2, 92.5, 210),
        (prog_id, 7, 1, bench_id, 2, 1, 97.5, 240),
        (prog_id, 8, 1, bench_id, 1, 1, 102.5, 300);
    END IF;
END $$;

-- 5. Жим по Р. Уэйлу (12 недель)
DO $$
DECLARE
    prog_id UUID;
    bench_id UUID;
BEGIN
    SELECT id INTO prog_id FROM training_program WHERE name = 'Жим по Р. Уэйлу';
    SELECT id INTO bench_id FROM exercise WHERE name = 'Жим лежа';
    
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, bench_id, 3, 10, 65.0, 90),
        (prog_id, 2, 1, bench_id, 3, 10, 67.5, 90),
        (prog_id, 3, 1, bench_id, 3, 8, 72.5, 120),
        (prog_id, 4, 1, bench_id, 3, 8, 75.0, 120),
        (prog_id, 5, 1, bench_id, 3, 5, 80.0, 150),
        (prog_id, 6, 1, bench_id, 3, 5, 82.5, 150),
        (prog_id, 7, 1, bench_id, 3, 3, 87.5, 180),
        (prog_id, 8, 1, bench_id, 3, 3, 90.0, 180),
        (prog_id, 9, 1, bench_id, 2, 2, 92.5, 210),
        (prog_id, 10, 1, bench_id, 2, 2, 95.0, 210),
        (prog_id, 11, 1, bench_id, 1, 1, 97.5, 240),
        (prog_id, 12, 1, bench_id, 1, 1, 102.5, 300);
    END IF;
END $$;

-- 6. Пиковый цикл Верхошанского (6 недель, 2 дня в неделю)
DO $$
DECLARE
    prog_id UUID;
    bench_id UUID;
BEGIN
    SELECT id INTO prog_id FROM training_program WHERE name = 'Пиковый цикл Верхошанского';
    SELECT id INTO bench_id FROM exercise WHERE name = 'Жим лежа';
    
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, bench_id, 5, 3, 80.0, 150),
        (prog_id, 1, 2, bench_id, 6, 2, 70.0, 90),
        (prog_id, 2, 1, bench_id, 5, 3, 82.5, 150),
        (prog_id, 2, 2, bench_id, 6, 2, 72.5, 90),
        (prog_id, 3, 1, bench_id, 4, 2, 87.5, 180),
        (prog_id, 3, 2, bench_id, 5, 2, 75.0, 90),
        (prog_id, 4, 1, bench_id, 3, 2, 92.5, 210),
        (prog_id, 4, 2, bench_id, 4, 2, 75.0, 90),
        (prog_id, 5, 1, bench_id, 2, 1, 97.5, 240),
        (prog_id, 5, 2, bench_id, 3, 2, 70.0, 90),
        (prog_id, 6, 1, bench_id, 1, 1, 102.5, 300);
    END IF;
END $$;

-- 7. Жим по Муравьеву (8 недель)
DO $$
DECLARE
    prog_id UUID;
    bench_id UUID;
BEGIN
    SELECT id INTO prog_id FROM training_program WHERE name = 'Жим по Муравьеву';
    SELECT id INTO bench_id FROM exercise WHERE name = 'Жим лежа';
    
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, bench_id, 4, 6, 70.0, 120),
        (prog_id, 2, 1, bench_id, 4, 5, 75.0, 120),
        (prog_id, 3, 1, bench_id, 4, 4, 80.0, 150),
        (prog_id, 4, 1, bench_id, 3, 3, 85.0, 180),
        (prog_id, 5, 1, bench_id, 3, 3, 87.5, 180),
        (prog_id, 6, 1, bench_id, 2, 2, 92.5, 210),
        (prog_id, 7, 1, bench_id, 2, 1, 97.5, 240),
        (prog_id, 8, 1, bench_id, 1, 1, 102.5, 300);
    END IF;
END $$;

-- 8. Суровецкий. Система Стандарт (6 недель, 2 дня в неделю)
DO $$
DECLARE
    prog_id UUID;
    bench_id UUID;
BEGIN
    SELECT id INTO prog_id FROM training_program WHERE name = 'Суровецкий. Система Стандарт';
    SELECT id INTO bench_id FROM exercise WHERE name = 'Жим лежа';
    
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, bench_id, 5, 5, 75.0, 120),
        (prog_id, 1, 2, bench_id, 4, 4, 70.0, 90),
        (prog_id, 2, 1, bench_id, 5, 4, 80.0, 150),
        (prog_id, 2, 2, bench_id, 4, 4, 72.5, 90),
        (prog_id, 3, 1, bench_id, 4, 3, 85.0, 180),
        (prog_id, 3, 2, bench_id, 4, 4, 75.0, 90),
        (prog_id, 4, 1, bench_id, 3, 3, 90.0, 180),
        (prog_id, 4, 2, bench_id, 3, 3, 75.0, 90),
        (prog_id, 5, 1, bench_id, 2, 2, 95.0, 210),
        (prog_id, 5, 2, bench_id, 3, 2, 70.0, 90),
        (prog_id, 6, 1, bench_id, 1, 1, 102.5, 300);
    END IF;
END $$;

-- 9. Суровецкий. Программа N1 (5 недель)
DO $$
DECLARE
    prog_id UUID;
    bench_id UUID;
BEGIN
    SELECT id INTO prog_id FROM training_program WHERE name = 'Суровецкий. Программа N1';
    SELECT id INTO bench_id FROM exercise WHERE name = 'Жим лежа';
    
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, bench_id, 6, 4, 80.0, 150),
        (prog_id, 1, 2, bench_id, 5, 3, 82.5, 150),
        (prog_id, 2, 1, bench_id, 5, 3, 85.0, 180),
        (prog_id, 2, 2, bench_id, 4, 3, 87.5, 180),
        (prog_id, 3, 1, bench_id, 4, 2, 90.0, 210),
        (prog_id, 3, 2, bench_id, 3, 2, 92.5, 210),
        (prog_id, 4, 1, bench_id, 3, 1, 95.0, 240),
        (prog_id, 4, 2, bench_id, 2, 1, 97.5, 240),
        (prog_id, 5, 1, bench_id, 1, 1, 105.0, 300);
    END IF;
END $$;

-- 10. Суровецкий. Программа N2 (7 недель)
DO $$
DECLARE
    prog_id UUID;
    bench_id UUID;
BEGIN
    SELECT id INTO prog_id FROM training_program WHERE name = 'Суровецкий. Программа N2';
    SELECT id INTO bench_id FROM exercise WHERE name = 'Жим лежа';
    
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, bench_id, 5, 5, 72.5, 120),
        (prog_id, 1, 2, bench_id, 4, 4, 70.0, 90),
        (prog_id, 2, 1, bench_id, 5, 5, 75.0, 120),
        (prog_id, 2, 2, bench_id, 4, 4, 72.5, 90),
        (prog_id, 3, 1, bench_id, 5, 4, 80.0, 150),
        (prog_id, 3, 2, bench_id, 4, 3, 75.0, 120),
        (prog_id, 4, 1, bench_id, 4, 3, 85.0, 180),
        (prog_id, 4, 2, bench_id, 4, 3, 77.5, 120),
        (prog_id, 5, 1, bench_id, 3, 3, 90.0, 180),
        (prog_id, 5, 2, bench_id, 3, 2, 80.0, 150),
        (prog_id, 6, 1, bench_id, 2, 2, 95.0, 210),
        (prog_id, 6, 2, bench_id, 2, 2, 75.0, 120),
        (prog_id, 7, 1, bench_id, 1, 1, 102.5, 300);
    END IF;
END $$;
