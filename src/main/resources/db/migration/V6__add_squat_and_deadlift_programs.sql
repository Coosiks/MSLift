-- Добавляем колонку movement_category в training_program для разделения на жим, присед и тягу
ALTER TABLE training_program ADD COLUMN IF NOT EXISTS movement_category VARCHAR(50) DEFAULT 'BENCH';

-- Обновляем существующие программы жима
UPDATE training_program SET movement_category = 'BENCH' WHERE movement_category IS NULL OR movement_category = 'BENCH';

-- =========================================================================
-- 1. ПРОГРАММЫ ДЛЯ ПРИСЕДАНИЙ (SQUAT)
-- =========================================================================

-- 1. Полный цикл Смолова
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Полный цикл Смолова (Smolov Squat Routine)', 'Легендарный 13-недельный ударный комплекс для приседаний из четырёх фаз: втягивающий микроцикл (2 нед), базовый мезоцикл (4 нед), восстановительное переключение (2 нед) и финальный интенсивный мезоцикл с выходом на пик (5 нед).', 13, 'SQUAT')
ON CONFLICT (name) DO NOTHING;

-- 2. Русский цикл (Russian Squat Routine / RSR)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Русский цикл (Russian Squat Routine)', 'Классическая советская 6-недельная схема с 3 тренировками приседа в неделю. Первая половина — накопление объема (с 6х2 до 6х6 на 80%), вторая половина — трансформация силы с выходом на 105%.', 6, 'SQUAT')
ON CONFLICT (name) DO NOTHING;

-- 3. Хэтфилд (Цикл «Доктора Приседа»)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Хэтфилд (Цикл «Доктора Приседа»)', '10-недельная периодизация Фреда Хэтфилда (первый человек, официально присевший 460 кг). Вариативная интенсивность, разделение на тяжелые и взрывные скоростные дни.', 10, 'SQUAT')
ON CONFLICT (name) DO NOTHING;

-- 4. Тяжёлый присед по В. Муравьёву
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Тяжёлый присед по В. Муравьёву', '8-недельная методика В. Муравьева из классики пауэрлифтинга. Чередование тяжелых объемных дней с легкими восстановительными для надежного роста без травм.', 8, 'SQUAT')
ON CONFLICT (name) DO NOTHING;

-- 5. Присед по Б. И. Шейко
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Присед по Б. И. Шейко', '4-недельный блок заслуженного тренера Б.И. Шейко. Высокий тоннаж на средних весах (70-85%) и сдвоенное прохождение приседа в рамках одной тренировки.', 4, 'SQUAT')
ON CONFLICT (name) DO NOTHING;

-- 6. Super Squats (Дыхательные приседания 20 повт.)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Super Squats (Дыхательные приседания)', 'Знаменитая олдскульная 6-недельная система. 3 тренировки в неделю вокруг одного экстремального дыхательного подхода на 20 повторений с глубокими вдохами.', 6, 'SQUAT')
ON CONFLICT (name) DO NOTHING;

-- 7. Техасский метод (Texas Method для приседа)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Техасский метод (Texas Method)', '4-недельный микроцикл Марка Риппто для среднего уровня: Понедельник — объем (5х5), Среда — разгрузка (2х5), Пятница — интенсивный рекорд (новый рекорд в 1-5 повт).', 4, 'SQUAT')
ON CONFLICT (name) DO NOTHING;

-- 8. Пиковый цикл Верхошанского (для приседа)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Пиковый цикл Верхошанского (для приседа)', '6-недельный цикл профессора Ю.В. Верхошанского для приседаний. Сочетание скоростной динамики и субмаксимальной интенсивности с выходом на пик.', 6, 'SQUAT')
ON CONFLICT (name) DO NOTHING;

-- =========================================================================
-- 2. ПРОГРАММЫ ДЛЯ СТАНОВОЙ ТЯГИ (DEADLIFT)
-- =========================================================================

-- 1. Магни-Орли
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Магни-Орли (Magnusson / Ortmayer)', '12-недельная программа Магнуссона и Ортмайера для тяги без экипировки. Фирменный протокол: 4х4 (70%) + 2х2 (80%) + финальный AMRAP-подход на максимум повторений.', 12, 'DEADLIFT')
ON CONFLICT (name) DO NOTHING;

-- 2. Цикл Эда Коэна и Филиппи
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Цикл Эда Коэна и Филиппи (Coan/Phillipi)', '10-недельная легендарная программа величайшего пауэрлифтера Эда Коэна. 1 тяжелый силовой подход, серия скоростных дублей и круговой подсобный блок.', 10, 'DEADLIFT')
ON CONFLICT (name) DO NOTHING;

-- 3. Мёртвая тяга по В. Кравцову
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Мёртвая тяга по В. Кравцову', '8-недельная низкообъемная методика рекордсмена В. Кравцова («Беспредельная сила»). Редкие, предельно концентрированные силовые тренировки для максимального восстановления.', 8, 'DEADLIFT')
ON CONFLICT (name) DO NOTHING;

-- 4. Становая тяга по Джорджу Лейману
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Становая тяга по Джорджу Лейману', '8-недельная специализация монстра тяги Джорджа Леймана. Сочетание тяжелой высокоповторной тяги и взрывных дотягов с плинтов.', 8, 'DEADLIFT')
ON CONFLICT (name) DO NOTHING;

-- 5. Тяга по Б. И. Шейко
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Тяга по Б. И. Шейко', '4-недельная схема школы Б.И. Шейко с разбивкой амплитуды: тяга до колен, тяга с плинтов и тяга из ямы. Огромный силовой тоннаж без перегрузки поясницы.', 4, 'DEADLIFT')
ON CONFLICT (name) DO NOTHING;

-- 6. Схема Боба Пиплза (Bob Peoples)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Схема Боба Пиплза (Bob Peoples)', '6-недельная классика Боба Пиплза (первый человек, потянувший более чем в 4 раза больше собственного веса). Сингловые подходы и частичные амплитуды.', 6, 'DEADLIFT')
ON CONFLICT (name) DO NOTHING;

-- 7. Цикл Мэтта Веннинга (Conjugate Deadlift)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Цикл Мэтта Веннинга (Conjugate Deadlift)', '8-недельный конъюгейт-метод Мэтта Веннинга (Westside Barbell). Еженедельная ротация дней максимальных усилий (ME) и динамических скоростных дней (DE).', 8, 'DEADLIFT')
ON CONFLICT (name) DO NOTHING;

-- =========================================================================
-- 3. УНИВЕРСАЛЬНЫЕ ПРОГРАММЫ (UNIVERSAL)
-- =========================================================================

-- 1. 5/3/1 Джима Вендлера (Присед и Тяга)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('5/3/1 Джима Вендлера (Присед и Тяга)', 'Оригинальный 4-недельный цикл Джима Вендлера под нижнюю часть тела. Недели: 3х5, 3х3, 5/3/1 (подход с плюсом на максимум) и восстановительный разгрузочный блок.', 4, 'UNIVERSAL')
ON CONFLICT (name) DO NOTHING;

-- 2. Метод Куба (The Cube Method Брэндона Лилли)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Метод Куба (The Cube Method)', '10-недельная ротационная система Брэндона Лилли. Вращение волн: Тяжелая неделя -> Взрывная неделя -> Повторная неделя, исключающее одновременный стресс на присед и тягу.', 10, 'UNIVERSAL')
ON CONFLICT (name) DO NOTHING;

-- 3. Линейный цикл В. С. Степанова
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Линейный цикл В. С. Степанова', '8-недельная академическая периодизация для соревновательных движений. От базовых четверок (4х6) к финишным пиковым синглам.', 8, 'UNIVERSAL')
ON CONFLICT (name) DO NOTHING;

-- 4. 6-недельный цикл Кэндито (Candito 6 Week)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('6-недельный цикл Кэндито (Candito)', 'Популярный мировой шаблон Джонни Кэндито. Фазы: адаптация (нед 1), гипертрофия (нед 2), максимальная сила (нед 3), тяжелая адаптация (нед 4), пик (нед 5), тест рекорда (нед 6).', 6, 'UNIVERSAL')
ON CONFLICT (name) DO NOTHING;


-- =========================================================================
-- ЗАПОЛНЕНИЕ ШАБЛОНОВ ДЛЯ НОВЫХ ПРОГРАММ (program_workout_template)
-- =========================================================================

DO $$
DECLARE
    squat_id UUID;
    deadlift_id UUID;
    prog_id UUID;
BEGIN
    SELECT id INTO squat_id FROM exercise WHERE name = 'Приседания';
    SELECT id INTO deadlift_id FROM exercise WHERE name = 'Становая тяга';

    -- 1. Русский цикл (RSR) для приседа (6 недель, 3 дня)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Русский цикл (Russian Squat Routine)';
    IF prog_id IS NOT NULL AND squat_id IS NOT NULL THEN
        -- W1
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, squat_id, 6, 2, 80.0, 120),
        (prog_id, 1, 2, squat_id, 6, 3, 80.0, 150),
        (prog_id, 1, 3, squat_id, 6, 2, 80.0, 120),
        -- W2
        (prog_id, 2, 1, squat_id, 6, 4, 80.0, 180),
        (prog_id, 2, 2, squat_id, 6, 2, 80.0, 120),
        (prog_id, 2, 3, squat_id, 6, 5, 80.0, 180),
        -- W3
        (prog_id, 3, 1, squat_id, 6, 2, 80.0, 120),
        (prog_id, 3, 2, squat_id, 6, 6, 80.0, 210),
        (prog_id, 3, 3, squat_id, 6, 2, 80.0, 120),
        -- W4
        (prog_id, 4, 1, squat_id, 5, 5, 85.0, 210),
        (prog_id, 4, 2, squat_id, 6, 2, 80.0, 120),
        (prog_id, 4, 3, squat_id, 4, 4, 90.0, 240),
        -- W5
        (prog_id, 5, 1, squat_id, 6, 2, 80.0, 120),
        (prog_id, 5, 2, squat_id, 3, 3, 95.0, 240),
        (prog_id, 5, 3, squat_id, 6, 2, 80.0, 120),
        -- W6
        (prog_id, 6, 1, squat_id, 2, 2, 100.0, 240),
        (prog_id, 6, 2, squat_id, 6, 2, 80.0, 120),
        (prog_id, 6, 3, squat_id, 1, 1, 105.0, 300);
    END IF;

    -- 2. Хэтфилд (10 недель приседа, 2 дня)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Хэтфилд (Цикл «Доктора Приседа»)';
    IF prog_id IS NOT NULL AND squat_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, squat_id, 5, 5, 70.0, 150), (prog_id, 1, 2, squat_id, 5, 3, 60.0, 90),
        (prog_id, 2, 1, squat_id, 5, 5, 72.5, 150), (prog_id, 2, 2, squat_id, 5, 3, 60.0, 90),
        (prog_id, 3, 1, squat_id, 5, 4, 75.0, 180), (prog_id, 3, 2, squat_id, 5, 3, 65.0, 90),
        (prog_id, 4, 1, squat_id, 5, 4, 77.5, 180), (prog_id, 4, 2, squat_id, 5, 3, 65.0, 90),
        (prog_id, 5, 1, squat_id, 4, 3, 80.0, 180), (prog_id, 5, 2, squat_id, 4, 3, 65.0, 90),
        (prog_id, 6, 1, squat_id, 4, 3, 85.0, 210), (prog_id, 6, 2, squat_id, 4, 3, 70.0, 90),
        (prog_id, 7, 1, squat_id, 3, 3, 90.0, 240), (prog_id, 7, 2, squat_id, 4, 2, 70.0, 90),
        (prog_id, 8, 1, squat_id, 3, 2, 95.0, 240), (prog_id, 8, 2, squat_id, 3, 2, 70.0, 90),
        (prog_id, 9, 1, squat_id, 2, 1, 100.0, 270), (prog_id, 9, 2, squat_id, 3, 2, 65.0, 90),
        (prog_id, 10, 1, squat_id, 1, 1, 105.0, 300);
    END IF;

    -- 3. Тяжёлый присед по В. Муравьёву (8 недель)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Тяжёлый присед по В. Муравьёву';
    IF prog_id IS NOT NULL AND squat_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, squat_id, 4, 6, 70.0, 150), (prog_id, 1, 2, squat_id, 4, 4, 60.0, 90),
        (prog_id, 2, 1, squat_id, 4, 5, 75.0, 150), (prog_id, 2, 2, squat_id, 4, 4, 60.0, 90),
        (prog_id, 3, 1, squat_id, 4, 4, 80.0, 180), (prog_id, 3, 2, squat_id, 4, 4, 65.0, 90),
        (prog_id, 4, 1, squat_id, 3, 3, 85.0, 180), (prog_id, 4, 2, squat_id, 4, 4, 65.0, 90),
        (prog_id, 5, 1, squat_id, 3, 3, 87.5, 210), (prog_id, 5, 2, squat_id, 4, 4, 65.0, 90),
        (prog_id, 6, 1, squat_id, 2, 2, 92.5, 240), (prog_id, 6, 2, squat_id, 3, 3, 65.0, 90),
        (prog_id, 7, 1, squat_id, 2, 1, 97.5, 270), (prog_id, 7, 2, squat_id, 3, 3, 60.0, 90),
        (prog_id, 8, 1, squat_id, 1, 1, 105.0, 300);
    END IF;

    -- 4. Super Squats (6 недель дыхательных приседаний 20 повторений)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Super Squats (Дыхательные приседания)';
    IF prog_id IS NOT NULL AND squat_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, squat_id, 1, 20, 65.0, 180), (prog_id, 1, 2, squat_id, 1, 20, 67.5, 180), (prog_id, 1, 3, squat_id, 1, 20, 70.0, 180),
        (prog_id, 2, 1, squat_id, 1, 20, 70.0, 180), (prog_id, 2, 2, squat_id, 1, 20, 72.5, 180), (prog_id, 2, 3, squat_id, 1, 20, 72.5, 180),
        (prog_id, 3, 1, squat_id, 1, 20, 75.0, 210), (prog_id, 3, 2, squat_id, 1, 20, 75.0, 210), (prog_id, 3, 3, squat_id, 1, 20, 77.5, 210),
        (prog_id, 4, 1, squat_id, 1, 20, 77.5, 240), (prog_id, 4, 2, squat_id, 1, 20, 80.0, 240), (prog_id, 4, 3, squat_id, 1, 20, 80.0, 240),
        (prog_id, 5, 1, squat_id, 1, 20, 82.5, 240), (prog_id, 5, 2, squat_id, 1, 20, 82.5, 240), (prog_id, 5, 3, squat_id, 1, 20, 85.0, 240),
        (prog_id, 6, 1, squat_id, 1, 20, 85.0, 240), (prog_id, 6, 2, squat_id, 1, 20, 87.5, 240), (prog_id, 6, 3, squat_id, 1, 20, 90.0, 300);
    END IF;

    -- 5. Техасский метод (Texas Method, 4 недели присед)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Техасский метод (Texas Method)';
    IF prog_id IS NOT NULL AND squat_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, squat_id, 5, 5, 75.0, 180), (prog_id, 1, 2, squat_id, 2, 5, 60.0, 120), (prog_id, 1, 3, squat_id, 1, 5, 85.0, 210),
        (prog_id, 2, 1, squat_id, 5, 5, 77.5, 180), (prog_id, 2, 2, squat_id, 2, 5, 60.0, 120), (prog_id, 2, 3, squat_id, 1, 5, 87.5, 210),
        (prog_id, 3, 1, squat_id, 5, 5, 80.0, 210), (prog_id, 3, 2, squat_id, 2, 5, 62.5, 120), (prog_id, 3, 3, squat_id, 1, 3, 92.5, 240),
        (prog_id, 4, 1, squat_id, 5, 5, 82.5, 210), (prog_id, 4, 2, squat_id, 2, 5, 62.5, 120), (prog_id, 4, 3, squat_id, 1, 1, 102.5, 300);
    END IF;

    -- 6. Пиковый цикл Верхошанского (для приседа) (6 недель)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Пиковый цикл Верхошанского (для приседа)';
    IF prog_id IS NOT NULL AND squat_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, squat_id, 5, 3, 80.0, 180), (prog_id, 1, 2, squat_id, 6, 2, 70.0, 120),
        (prog_id, 2, 1, squat_id, 5, 3, 82.5, 180), (prog_id, 2, 2, squat_id, 6, 2, 72.5, 120),
        (prog_id, 3, 1, squat_id, 4, 2, 87.5, 210), (prog_id, 3, 2, squat_id, 5, 2, 75.0, 120),
        (prog_id, 4, 1, squat_id, 3, 2, 92.5, 240), (prog_id, 4, 2, squat_id, 4, 2, 75.0, 120),
        (prog_id, 5, 1, squat_id, 2, 1, 97.5, 270), (prog_id, 5, 2, squat_id, 3, 2, 70.0, 120),
        (prog_id, 6, 1, squat_id, 1, 1, 105.0, 300);
    END IF;

    -- 7. Присед по Б. И. Шейко (4 недели)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Присед по Б. И. Шейко';
    IF prog_id IS NOT NULL AND squat_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, squat_id, 5, 3, 70.0, 150), (prog_id, 1, 2, squat_id, 5, 3, 75.0, 150), (prog_id, 1, 3, squat_id, 5, 2, 80.0, 180),
        (prog_id, 2, 1, squat_id, 5, 3, 75.0, 150), (prog_id, 2, 2, squat_id, 5, 2, 80.0, 180), (prog_id, 2, 3, squat_id, 4, 2, 82.5, 180),
        (prog_id, 3, 1, squat_id, 5, 2, 80.0, 180), (prog_id, 3, 2, squat_id, 4, 2, 85.0, 210), (prog_id, 3, 3, squat_id, 3, 2, 85.0, 210),
        (prog_id, 4, 1, squat_id, 3, 2, 85.0, 180), (prog_id, 4, 2, squat_id, 3, 1, 90.0, 240), (prog_id, 4, 3, squat_id, 1, 1, 102.5, 300);
    END IF;

    -- 8. Полный цикл Смолова (13 недель присед)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Полный цикл Смолова (Smolov Squat Routine)';
    IF prog_id IS NOT NULL AND squat_id IS NOT NULL THEN
        -- Фаза 1: Втягивающий микроцикл (W1-W2)
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, squat_id, 3, 8, 65.0, 120), (prog_id, 1, 2, squat_id, 3, 5, 70.0, 150), (prog_id, 1, 3, squat_id, 4, 2, 75.0, 150),
        (prog_id, 2, 1, squat_id, 3, 8, 67.5, 120), (prog_id, 2, 2, squat_id, 3, 5, 72.5, 150), (prog_id, 2, 3, squat_id, 4, 2, 80.0, 180),
        -- Фаза 2: Базовый мезоцикл (W3-W6)
        (prog_id, 3, 1, squat_id, 4, 9, 70.0, 180), (prog_id, 3, 2, squat_id, 5, 7, 75.0, 180), (prog_id, 3, 3, squat_id, 7, 5, 80.0, 210), (prog_id, 3, 4, squat_id, 10, 3, 85.0, 240),
        (prog_id, 4, 1, squat_id, 4, 9, 72.5, 180), (prog_id, 4, 2, squat_id, 5, 7, 77.5, 180), (prog_id, 4, 3, squat_id, 7, 5, 82.5, 210), (prog_id, 4, 4, squat_id, 10, 3, 87.5, 240),
        (prog_id, 5, 1, squat_id, 4, 9, 75.0, 180), (prog_id, 5, 2, squat_id, 5, 7, 80.0, 180), (prog_id, 5, 3, squat_id, 7, 5, 85.0, 210), (prog_id, 5, 4, squat_id, 10, 3, 90.0, 240),
        (prog_id, 6, 1, squat_id, 1, 1, 100.0, 300),
        -- Фаза 3: Переключение (W7-W8)
        (prog_id, 7, 1, squat_id, 4, 3, 65.0, 90), (prog_id, 7, 2, squat_id, 4, 3, 70.0, 90),
        (prog_id, 8, 1, squat_id, 4, 3, 65.0, 90), (prog_id, 8, 2, squat_id, 4, 3, 70.0, 90),
        -- Фаза 4: Интенсивный мезоцикл (W9-W12)
        (prog_id, 9, 1, squat_id, 4, 4, 80.0, 180), (prog_id, 9, 2, squat_id, 5, 3, 85.0, 210), (prog_id, 9, 3, squat_id, 4, 4, 80.0, 180),
        (prog_id, 10, 1, squat_id, 4, 3, 85.0, 210), (prog_id, 10, 2, squat_id, 4, 3, 90.0, 240), (prog_id, 10, 3, squat_id, 3, 4, 85.0, 210),
        (prog_id, 11, 1, squat_id, 3, 3, 90.0, 240), (prog_id, 11, 2, squat_id, 3, 3, 92.5, 240), (prog_id, 11, 3, squat_id, 3, 3, 90.0, 240),
        (prog_id, 12, 1, squat_id, 3, 2, 95.0, 270), (prog_id, 12, 2, squat_id, 2, 2, 97.5, 270), (prog_id, 12, 3, squat_id, 3, 2, 92.5, 240),
        -- Неделя 13: Пик
        (prog_id, 13, 1, squat_id, 1, 1, 107.5, 300);
    END IF;

    -- =========================================================================
    -- СТАНОВАЯ ТЯГА
    -- =========================================================================

    -- 1. Магни-Орли (12 недель)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Магни-Орли (Magnusson / Ortmayer)';
    IF prog_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, deadlift_id, 4, 4, 70.0, 150), (prog_id, 1, 1, deadlift_id, 2, 2, 80.0, 180), (prog_id, 1, 1, deadlift_id, 1, 8, 70.0, 210),
        (prog_id, 2, 1, deadlift_id, 4, 4, 70.0, 150), (prog_id, 2, 1, deadlift_id, 2, 2, 82.5, 180), (prog_id, 2, 1, deadlift_id, 1, 8, 72.5, 210),
        (prog_id, 3, 1, deadlift_id, 4, 4, 72.5, 150), (prog_id, 3, 1, deadlift_id, 2, 2, 85.0, 180), (prog_id, 3, 1, deadlift_id, 1, 8, 75.0, 210),
        (prog_id, 4, 1, deadlift_id, 3, 3, 60.0, 120), -- Deload
        (prog_id, 5, 1, deadlift_id, 4, 4, 72.5, 150), (prog_id, 5, 1, deadlift_id, 2, 2, 87.5, 210), (prog_id, 5, 1, deadlift_id, 1, 8, 75.0, 210),
        (prog_id, 6, 1, deadlift_id, 4, 4, 75.0, 150), (prog_id, 6, 1, deadlift_id, 2, 2, 90.0, 210), (prog_id, 6, 1, deadlift_id, 1, 6, 77.5, 210),
        (prog_id, 7, 1, deadlift_id, 4, 4, 75.0, 150), (prog_id, 7, 1, deadlift_id, 2, 2, 92.5, 240), (prog_id, 7, 1, deadlift_id, 1, 6, 80.0, 210),
        (prog_id, 8, 1, deadlift_id, 3, 3, 60.0, 120), -- Deload
        (prog_id, 9, 1, deadlift_id, 4, 4, 75.0, 150), (prog_id, 9, 1, deadlift_id, 2, 2, 95.0, 240), (prog_id, 9, 1, deadlift_id, 1, 5, 82.5, 210),
        (prog_id, 10, 1, deadlift_id, 3, 3, 75.0, 150), (prog_id, 10, 1, deadlift_id, 2, 2, 97.5, 270),
        (prog_id, 11, 1, deadlift_id, 3, 2, 70.0, 120),
        (prog_id, 12, 1, deadlift_id, 1, 1, 105.0, 300); -- Peak
    END IF;

    -- 2. Цикл Эда Коэна и Филиппи (10 недель)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Цикл Эда Коэна и Филиппи (Coan/Phillipi)';
    IF prog_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, deadlift_id, 1, 2, 75.0, 180), (prog_id, 1, 1, deadlift_id, 8, 3, 60.0, 120),
        (prog_id, 2, 1, deadlift_id, 1, 2, 80.0, 180), (prog_id, 2, 1, deadlift_id, 8, 3, 65.0, 120),
        (prog_id, 3, 1, deadlift_id, 1, 2, 85.0, 210), (prog_id, 3, 1, deadlift_id, 6, 3, 70.0, 120),
        (prog_id, 4, 1, deadlift_id, 1, 2, 87.5, 210), (prog_id, 4, 1, deadlift_id, 5, 3, 72.5, 120),
        (prog_id, 5, 1, deadlift_id, 1, 3, 90.0, 240), (prog_id, 5, 1, deadlift_id, 4, 3, 75.0, 120),
        (prog_id, 6, 1, deadlift_id, 1, 2, 92.5, 240), (prog_id, 6, 1, deadlift_id, 3, 3, 77.5, 120),
        (prog_id, 7, 1, deadlift_id, 1, 2, 95.0, 240), (prog_id, 7, 1, deadlift_id, 3, 3, 80.0, 120),
        (prog_id, 8, 1, deadlift_id, 1, 2, 97.5, 270), (prog_id, 8, 1, deadlift_id, 2, 3, 82.5, 120),
        (prog_id, 9, 1, deadlift_id, 1, 1, 100.0, 270), (prog_id, 9, 1, deadlift_id, 2, 2, 85.0, 150),
        (prog_id, 10, 1, deadlift_id, 1, 1, 105.0, 300);
    END IF;

    -- 3. Мёртвая тяга по В. Кравцову (8 недель)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Мёртвая тяга по В. Кравцову';
    IF prog_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, deadlift_id, 3, 3, 80.0, 210),
        (prog_id, 2, 1, deadlift_id, 3, 3, 82.5, 210),
        (prog_id, 3, 1, deadlift_id, 3, 2, 87.5, 240),
        (prog_id, 4, 1, deadlift_id, 2, 2, 90.0, 240),
        (prog_id, 5, 1, deadlift_id, 2, 2, 92.5, 240),
        (prog_id, 6, 1, deadlift_id, 2, 1, 97.5, 270),
        (prog_id, 7, 1, deadlift_id, 2, 3, 60.0, 120), -- Deload
        (prog_id, 8, 1, deadlift_id, 1, 1, 105.0, 300);
    END IF;

    -- 4. Становая тяга по Джорджу Лейману (8 недель)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Становая тяга по Джорджу Лейману';
    IF prog_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, deadlift_id, 1, 12, 70.0, 210), (prog_id, 1, 1, deadlift_id, 3, 3, 85.0, 210),
        (prog_id, 2, 1, deadlift_id, 1, 10, 75.0, 210), (prog_id, 2, 1, deadlift_id, 3, 3, 87.5, 210),
        (prog_id, 3, 1, deadlift_id, 1, 8, 80.0, 240), (prog_id, 3, 1, deadlift_id, 3, 2, 90.0, 240),
        (prog_id, 4, 1, deadlift_id, 1, 6, 85.0, 240), (prog_id, 4, 1, deadlift_id, 3, 2, 92.5, 240),
        (prog_id, 5, 1, deadlift_id, 1, 5, 87.5, 240), (prog_id, 5, 1, deadlift_id, 2, 2, 95.0, 240),
        (prog_id, 6, 1, deadlift_id, 1, 3, 92.5, 270), (prog_id, 6, 1, deadlift_id, 2, 1, 100.0, 270),
        (prog_id, 7, 1, deadlift_id, 3, 3, 60.0, 120), -- Deload
        (prog_id, 8, 1, deadlift_id, 1, 1, 105.0, 300);
    END IF;

    -- 5. Тяга по Б. И. Шейко (4 недели)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Тяга по Б. И. Шейко';
    IF prog_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, deadlift_id, 4, 3, 70.0, 150), (prog_id, 1, 2, deadlift_id, 5, 3, 80.0, 180),
        (prog_id, 2, 1, deadlift_id, 4, 3, 65.0, 150), (prog_id, 2, 2, deadlift_id, 5, 3, 75.0, 180),
        (prog_id, 3, 1, deadlift_id, 5, 3, 85.0, 210), (prog_id, 3, 2, deadlift_id, 4, 2, 75.0, 150),
        (prog_id, 4, 1, deadlift_id, 3, 2, 85.0, 180), (prog_id, 4, 2, deadlift_id, 1, 1, 102.5, 300);
    END IF;

    -- 6. Схема Боба Пиплза (6 недель)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Схема Боба Пиплза (Bob Peoples)';
    IF prog_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, deadlift_id, 5, 1, 85.0, 180),
        (prog_id, 2, 1, deadlift_id, 5, 1, 87.5, 180),
        (prog_id, 3, 1, deadlift_id, 4, 1, 90.0, 210),
        (prog_id, 4, 1, deadlift_id, 3, 1, 95.0, 240),
        (prog_id, 5, 1, deadlift_id, 2, 1, 97.5, 270),
        (prog_id, 6, 1, deadlift_id, 1, 1, 105.0, 300);
    END IF;

    -- 7. Цикл Мэтта Веннинга (8 недель)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Цикл Мэтта Веннинга (Conjugate Deadlift)';
    IF prog_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, deadlift_id, 3, 3, 80.0, 180), (prog_id, 1, 2, deadlift_id, 6, 1, 65.0, 90),
        (prog_id, 2, 1, deadlift_id, 3, 2, 85.0, 180), (prog_id, 2, 2, deadlift_id, 6, 1, 65.0, 90),
        (prog_id, 3, 1, deadlift_id, 3, 1, 90.0, 210), (prog_id, 3, 2, deadlift_id, 6, 1, 70.0, 90),
        (prog_id, 4, 1, deadlift_id, 2, 1, 95.0, 240), (prog_id, 4, 2, deadlift_id, 6, 1, 70.0, 90),
        (prog_id, 5, 1, deadlift_id, 3, 2, 87.5, 210), (prog_id, 5, 2, deadlift_id, 5, 1, 72.5, 90),
        (prog_id, 6, 1, deadlift_id, 2, 1, 97.5, 240), (prog_id, 6, 2, deadlift_id, 5, 1, 72.5, 90),
        (prog_id, 7, 1, deadlift_id, 1, 1, 100.0, 270), (prog_id, 7, 2, deadlift_id, 4, 1, 60.0, 90),
        (prog_id, 8, 1, deadlift_id, 1, 1, 105.0, 300);
    END IF;

    -- =========================================================================
    -- УНИВЕРСАЛЬНЫЕ ПРОГРАММЫ
    -- =========================================================================

    -- 1. 5/3/1 Джима Вендлера (Присед и Тяга)
    SELECT id INTO prog_id FROM training_program WHERE name = '5/3/1 Джима Вендлера (Присед и Тяга)';
    IF prog_id IS NOT NULL AND squat_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        -- Неделя 1 (3x5): День 1 Присед, День 2 Тяга
        (prog_id, 1, 1, squat_id, 1, 5, 65.0, 150), (prog_id, 1, 1, squat_id, 1, 5, 75.0, 180), (prog_id, 1, 1, squat_id, 1, 5, 85.0, 210),
        (prog_id, 1, 2, deadlift_id, 1, 5, 65.0, 150), (prog_id, 1, 2, deadlift_id, 1, 5, 75.0, 180), (prog_id, 1, 2, deadlift_id, 1, 5, 85.0, 210),
        -- Неделя 2 (3x3)
        (prog_id, 2, 1, squat_id, 1, 3, 70.0, 150), (prog_id, 2, 1, squat_id, 1, 3, 80.0, 180), (prog_id, 2, 1, squat_id, 1, 3, 90.0, 210),
        (prog_id, 2, 2, deadlift_id, 1, 3, 70.0, 150), (prog_id, 2, 2, deadlift_id, 1, 3, 80.0, 180), (prog_id, 2, 2, deadlift_id, 1, 3, 90.0, 210),
        -- Неделя 3 (5/3/1)
        (prog_id, 3, 1, squat_id, 1, 5, 75.0, 180), (prog_id, 3, 1, squat_id, 1, 3, 85.0, 210), (prog_id, 3, 1, squat_id, 1, 1, 95.0, 240),
        (prog_id, 3, 2, deadlift_id, 1, 5, 75.0, 180), (prog_id, 3, 2, deadlift_id, 1, 3, 85.0, 210), (prog_id, 3, 2, deadlift_id, 1, 1, 95.0, 240),
        -- Неделя 4 (Deload)
        (prog_id, 4, 1, squat_id, 1, 5, 40.0, 90), (prog_id, 4, 1, squat_id, 1, 5, 50.0, 90), (prog_id, 4, 1, squat_id, 1, 5, 60.0, 90),
        (prog_id, 4, 2, deadlift_id, 1, 5, 40.0, 90), (prog_id, 4, 2, deadlift_id, 1, 5, 50.0, 90), (prog_id, 4, 2, deadlift_id, 1, 5, 60.0, 90);
    END IF;

    -- 2. Метод Куба (The Cube Method) (10 недель)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Метод Куба (The Cube Method)';
    IF prog_id IS NOT NULL AND squat_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        -- Ротация: D1 Присед, D2 Тяга
        (prog_id, 1, 1, squat_id, 5, 2, 80.0, 180), (prog_id, 1, 2, deadlift_id, 8, 3, 65.0, 120),
        (prog_id, 2, 1, squat_id, 8, 3, 65.0, 120), (prog_id, 2, 2, deadlift_id, 3, 8, 70.0, 150),
        (prog_id, 3, 1, squat_id, 3, 8, 70.0, 150), (prog_id, 3, 2, deadlift_id, 5, 2, 80.0, 180),
        (prog_id, 4, 1, squat_id, 5, 2, 85.0, 210), (prog_id, 4, 2, deadlift_id, 8, 3, 70.0, 120),
        (prog_id, 5, 1, squat_id, 8, 3, 70.0, 120), (prog_id, 5, 2, deadlift_id, 3, 6, 75.0, 150),
        (prog_id, 6, 1, squat_id, 3, 6, 75.0, 150), (prog_id, 6, 2, deadlift_id, 5, 2, 85.0, 210),
        (prog_id, 7, 1, squat_id, 3, 2, 90.0, 240), (prog_id, 7, 2, deadlift_id, 6, 2, 75.0, 120),
        (prog_id, 8, 1, squat_id, 6, 2, 75.0, 120), (prog_id, 8, 2, deadlift_id, 3, 5, 80.0, 180),
        (prog_id, 9, 1, squat_id, 3, 5, 80.0, 180), (prog_id, 9, 2, deadlift_id, 3, 2, 90.0, 240),
        (prog_id, 10, 1, squat_id, 1, 1, 105.0, 300), (prog_id, 10, 2, deadlift_id, 1, 1, 105.0, 300);
    END IF;

    -- 3. Линейный цикл В. С. Степанова (8 недель)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Линейный цикл В. С. Степанова';
    IF prog_id IS NOT NULL AND squat_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, squat_id, 4, 6, 70.0, 150), (prog_id, 1, 2, deadlift_id, 4, 6, 70.0, 150),
        (prog_id, 2, 1, squat_id, 4, 5, 75.0, 150), (prog_id, 2, 2, deadlift_id, 4, 5, 75.0, 150),
        (prog_id, 3, 1, squat_id, 4, 4, 80.0, 180), (prog_id, 3, 2, deadlift_id, 4, 4, 80.0, 180),
        (prog_id, 4, 1, squat_id, 3, 3, 85.0, 180), (prog_id, 4, 2, deadlift_id, 3, 3, 85.0, 180),
        (prog_id, 5, 1, squat_id, 3, 3, 87.5, 210), (prog_id, 5, 2, deadlift_id, 3, 3, 87.5, 210),
        (prog_id, 6, 1, squat_id, 2, 2, 92.5, 240), (prog_id, 6, 2, deadlift_id, 2, 2, 92.5, 240),
        (prog_id, 7, 1, squat_id, 2, 1, 97.5, 270), (prog_id, 7, 2, deadlift_id, 2, 1, 97.5, 270),
        (prog_id, 8, 1, squat_id, 1, 1, 102.5, 300), (prog_id, 8, 2, deadlift_id, 1, 1, 102.5, 300);
    END IF;

    -- 4. 6-недельный цикл Кэндито (Candito) (6 недель)
    SELECT id INTO prog_id FROM training_program WHERE name = '6-недельный цикл Кэндито (Candito)';
    IF prog_id IS NOT NULL AND squat_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        -- Неделя 1: Адаптация
        (prog_id, 1, 1, squat_id, 4, 6, 70.0, 150), (prog_id, 1, 2, deadlift_id, 4, 6, 70.0, 150),
        -- Неделя 2: Гипертрофия
        (prog_id, 2, 1, squat_id, 4, 8, 72.5, 180), (prog_id, 2, 2, deadlift_id, 4, 6, 75.0, 180),
        -- Неделя 3: Максимальная сила
        (prog_id, 3, 1, squat_id, 4, 4, 82.5, 180), (prog_id, 3, 2, deadlift_id, 3, 3, 85.0, 180),
        -- Неделя 4: Тяжелая адаптация
        (prog_id, 4, 1, squat_id, 3, 3, 87.5, 210), (prog_id, 4, 2, deadlift_id, 3, 2, 90.0, 210),
        -- Неделя 5: Пик
        (prog_id, 5, 1, squat_id, 2, 2, 95.0, 240), (prog_id, 5, 2, deadlift_id, 2, 1, 97.5, 240),
        -- Неделя 6: Тест 1ПМ
        (prog_id, 6, 1, squat_id, 1, 1, 105.0, 300), (prog_id, 6, 2, deadlift_id, 1, 1, 105.0, 300);
    END IF;
END $$;
