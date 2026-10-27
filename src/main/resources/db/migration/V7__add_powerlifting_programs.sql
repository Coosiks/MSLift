-- =========================================================================
-- V7: ДОБАВЛЕНИЕ ПРОГРАММ ДЛЯ ПОДГОТОВКИ К ТРОЕБОРЬЮ (SBD: ПРИСЕД, ЖИМ, ТЯГА)
-- =========================================================================

-- 1. План Б. И. Шейко: Разрядники
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('План Б. И. Шейко: Разрядники (13 недель)', 'Классический 13-недельный базовый цикл заслуженного тренера Б.И. Шейко для спортсменов массовых разрядов. Умеренные рабочие веса (70-80%) с большим объемом подходов для постановки образцовой соревновательной техники и набора фундамента.', 13, 'POWERLIFTING')
ON CONFLICT (name) DO NOTHING;

-- 2. План Б. И. Шейко: КМС / МС
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('План Б. И. Шейко: КМС / МС (№29 + №30 + №32)', 'Связка из трех легендарных помесячных планов Шейко (12 недель): №29 (подготовительный объем) -> №30 (соревновательный силовой мезоцикл) -> №32 (пиковый выход на помост). Разработан для опытных пауэрлифтеров.', 12, 'POWERLIFTING')
ON CONFLICT (name) DO NOTHING;

-- 3. Система А. Фалеева (5х5)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Система А. Фалеева (Базовый цикл 5×5)', 'Популярнейшая отечественная минималистичная схема без подсобных упражнений: 3 дня в неделю, 1 день = 1 соревновательное движение. Чередование тяжелых (100% от 5х5) и легких (80%) тренировок с переходом на тройки и синглы в финале.', 12, 'POWERLIFTING')
ON CONFLICT (name) DO NOTHING;

-- 4. Цикл В. Муравьёва («Путь к силе»)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Цикл В. Муравьёва («Путь к силе»)', 'Сбалансированный 10-недельный троеборный план из книги «Пауэрлифтинг. Путь к силе». Разумное разведение тяжелых тренировок приседа, жима и тяги по разным дням для полноценного восстановления связок и ЦНС.', 10, 'POWERLIFTING')
ON CONFLICT (name) DO NOTHING;

-- 5. Силовой цикл Л. А. Остапенко
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Силовой цикл Л. А. Остапенко (14 недель)', 'Строгая академическая советская периодизация: 6 недель работы на объем и плотность мышечной массы, 5 недель чисто силовой фазы и 3 недели пиковой подводки к новым рекордам в троеборье.', 14, 'POWERLIFTING')
ON CONFLICT (name) DO NOTHING;

-- 6. 5/3/1 Джима Вендлера (Powerlifting-версия)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('5/3/1 Джима Вендлера (Powerlifting-версия)', 'Специальная пауэрлифтерская версия 5/3/1. Проценты от тренировочного максимума (90% от 1ПМ) с включением тяжелых соревновательных синглов (Joker sets) перед подходами с плюсом.', 4, 'POWERLIFTING')
ON CONFLICT (name) DO NOTHING;

-- 7. Техасский метод (Texas Method для троеборья)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Техасский метод (Texas Method — Троеборье)', 'Недельная волнообразная периодизация: Понедельник — объемный день 5х5 для приседа и жима, Среда — легкая активная разгрузка, Пятница — выход на новый рекордный вес (новый 5ПМ, 3ПМ или 1ПМ).', 4, 'POWERLIFTING')
ON CONFLICT (name) DO NOTHING;

-- 8. Candito 6 Week Strength Program (Троеборье)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Candito 6 Week Strength Program (Троеборье)', 'Мировой хит Джонни Кэндито для всех трех движений: от мышечной выносливости и гипертрофии к тяжелым двойкам, тройкам и проходке на помосте на 6-й неделе.', 6, 'POWERLIFTING')
ON CONFLICT (name) DO NOTHING;

-- 9. Calgary Barbell (16 недель)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Calgary Barbell (16 недель)', 'Современный международный эталон подготовки к соревнованиям по безэкипировочному пауэрлифтингу (IPF). 4 мезоцикла по 4 недели с плавным снижением повторов и выходом на соревновательные синглы.', 16, 'POWERLIFTING')
ON CONFLICT (name) DO NOTHING;

-- 10. Метод Куба (The Cube Method — Троеборье)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Метод Куба (The Cube Method — Троеборье)', 'Троеборная ротационная система Брэндона Лилли: присед, жим и тяга циклично сменяют тип нагрузки (Тяжелая -> Взрывная на скорость -> Повторный памп), защищая ЦНС от перетренированности.', 10, 'POWERLIFTING')
ON CONFLICT (name) DO NOTHING;

-- 11. Korte 3×3 (Немецкая система Стефана Корте)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Korte 3×3 (Немецкая система Стефана Корте)', 'Немецкая система без единого подсобного упражнения. Присед, жим и тяга выполняются на каждой тренировке 3 раза в неделю: 4 недели колоссального объема на 58-64% и 4 недели выхода на пик до 95-102%.', 8, 'POWERLIFTING')
ON CONFLICT (name) DO NOTHING;

-- 12. 9-недельный пиковый цикл TSA (The Strength Athlete)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('9-недельный пиковый цикл TSA (The Strength Athlete)', 'Выверенная программа ведущей пауэрлифтерской академии The Strength Athlete: 4 недели накопления объема, 1 неделя разгрузки и 4 недели турнирной подводки к помосту.', 9, 'POWERLIFTING')
ON CONFLICT (name) DO NOTHING;

-- 13. Juggernaut Method 2.0 (16 недель)
INSERT INTO training_program (name, description, duration_weeks, movement_category) VALUES
('Juggernaut Method 2.0 (16 недель)', 'Глобальная блоковая система Чеда Уэсли Смита из 4 волн по 4 недели (волна 10 повт -> 8 повт -> 5 повт -> 3 повт) с AMRAP подходами на максимум для приседа, жима и тяги.', 16, 'POWERLIFTING')
ON CONFLICT (name) DO NOTHING;


-- =========================================================================
-- ЗАПОЛНЕНИЕ ШАБЛОНОВ ТРЕНИРОВОК ДЛЯ ТРОЕБОРЬЯ
-- =========================================================================

DO $$
DECLARE
    bench_id UUID;
    squat_id UUID;
    deadlift_id UUID;
    prog_id UUID;
BEGIN
    SELECT id INTO bench_id FROM exercise WHERE name = 'Жим лежа';
    SELECT id INTO squat_id FROM exercise WHERE name = 'Приседания';
    SELECT id INTO deadlift_id FROM exercise WHERE name = 'Становая тяга';

    -- 1. Korte 3x3 (8 недель, Присед + Жим + Тяга в один день!)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Korte 3×3 (Немецкая система Стефана Корте)';
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL AND squat_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        -- Фаза 1: Объем (W1-W4) - 5-8 подходов по 5 повторений @ 58-64%
        FOR w IN 1..4 LOOP
            FOR d IN 1..3 LOOP
                INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
                (prog_id, w, d, squat_id, 6, 5, 58.0 + (w * 1.5), 150),
                (prog_id, w, d, bench_id, 6, 5, 58.0 + (w * 1.5), 120),
                (prog_id, w, d, deadlift_id, 5, 5, 58.0 + (w * 1.5), 180);
            END LOOP;
        END LOOP;
        -- Фаза 2: Соревновательный пик (W5-W8) - 1-2 подхода по 1-3 повторения @ 80-95%
        FOR w IN 5..8 LOOP
            FOR d IN 1..3 LOOP
                INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
                (prog_id, w, d, squat_id, 3, 2, 80.0 + ((w - 4) * 4.0), 210),
                (prog_id, w, d, bench_id, 3, 2, 80.0 + ((w - 4) * 4.0), 180),
                (prog_id, w, d, deadlift_id, 2, 1, 80.0 + ((w - 4) * 4.0), 240);
            END LOOP;
        END LOOP;
    END IF;

    -- 2. Система Фалеева 5х5 (12 недель: D1 Присед, D2 Жим, D3 Тяга)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Система А. Фалеева (Базовый цикл 5×5)';
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL AND squat_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        -- Недели 1-8: базовые 5х5 с волновой нагрузкой
        FOR w IN 1..8 LOOP
            INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
            (prog_id, w, 1, squat_id, 5, 5, 70.0 + (w * 2.0), 180),
            (prog_id, w, 2, bench_id, 5, 5, 70.0 + (w * 2.0), 150),
            (prog_id, w, 3, deadlift_id, 5, 5, 70.0 + (w * 2.0), 210);
        END LOOP;
        -- Недели 9-11: переход на тройки 3х3 и двойки
        FOR w IN 9..11 LOOP
            INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
            (prog_id, w, 1, squat_id, 3, 3, 88.0 + ((w - 8) * 3.0), 240),
            (prog_id, w, 2, bench_id, 3, 3, 88.0 + ((w - 8) * 3.0), 180),
            (prog_id, w, 3, deadlift_id, 3, 2, 88.0 + ((w - 8) * 3.0), 240);
        END LOOP;
        -- Неделя 12: Пиковая проходка
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 12, 1, squat_id, 1, 1, 105.0, 300),
        (prog_id, 12, 2, bench_id, 1, 1, 105.0, 240),
        (prog_id, 12, 3, deadlift_id, 1, 1, 105.0, 300);
    END IF;

    -- 3. Цикл В. Муравьёва («Путь к силе») (10 недель)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Цикл В. Муравьёва («Путь к силе»)';
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL AND squat_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        FOR w IN 1..10 LOOP
            INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
            -- День 1: Присед тяжелый + Жим легкий
            (prog_id, w, 1, squat_id, 4, 4, 70.0 + (w * 2.5), 180),
            (prog_id, w, 1, bench_id, 4, 4, 60.0, 120),
            -- День 2: Жим тяжелый + Присед легкий
            (prog_id, w, 2, bench_id, 4, 4, 70.0 + (w * 2.5), 180),
            (prog_id, w, 2, squat_id, 3, 4, 60.0, 120),
            -- День 3: Тяга тяжелая + Жим средний
            (prog_id, w, 3, deadlift_id, 4, 3, 70.0 + (w * 2.5), 210),
            (prog_id, w, 3, bench_id, 3, 3, 67.5, 120);
        END LOOP;
    END IF;

    -- 4. План Шейко: Разрядники (13 недель)
    SELECT id INTO prog_id FROM training_program WHERE name = 'План Б. И. Шейко: Разрядники (13 недель)';
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL AND squat_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        FOR w IN 1..13 LOOP
            INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
            -- День 1: Присед + Жим 1 + Присед 2
            (prog_id, w, 1, squat_id, 5, 3, 70.0 + (w * 1.2), 150),
            (prog_id, w, 1, bench_id, 5, 3, 70.0 + (w * 1.2), 120),
            (prog_id, w, 1, squat_id, 4, 2, 75.0 + (w * 1.0), 150),
            -- День 2: Тяга + Жим
            (prog_id, w, 2, deadlift_id, 5, 3, 72.5 + (w * 1.2), 180),
            (prog_id, w, 2, bench_id, 5, 4, 70.0 + (w * 1.0), 120),
            -- День 3: Присед + Жим
            (prog_id, w, 3, squat_id, 5, 3, 75.0 + (w * 1.2), 180),
            (prog_id, w, 3, bench_id, 6, 3, 72.5 + (w * 1.2), 150);
        END LOOP;
    END IF;

    -- 5. План Шейко: КМС / МС (12 недель)
    SELECT id INTO prog_id FROM training_program WHERE name = 'План Б. И. Шейко: КМС / МС (№29 + №30 + №32)';
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL AND squat_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        FOR w IN 1..12 LOOP
            INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
            -- День 1: Присед + Жим
            (prog_id, w, 1, squat_id, 5, 2, 75.0 + (w * 1.5), 180),
            (prog_id, w, 1, bench_id, 5, 3, 75.0 + (w * 1.5), 150),
            -- День 2: Тяга + Жим
            (prog_id, w, 2, deadlift_id, 5, 2, 77.5 + (w * 1.5), 210),
            (prog_id, w, 2, bench_id, 6, 2, 80.0 + (w * 1.0), 150),
            -- День 3: Присед + Жим
            (prog_id, w, 3, squat_id, 4, 2, 80.0 + (w * 1.5), 210),
            (prog_id, w, 3, bench_id, 5, 2, 80.0 + (w * 1.5), 180);
        END LOOP;
    END IF;

    -- 6. Силовой цикл Остапенко (14 недель)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Силовой цикл Л. А. Остапенко (14 недель)';
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL AND squat_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        -- Фаза 1: Объем W1-W6
        FOR w IN 1..6 LOOP
            INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
            (prog_id, w, 1, squat_id, 4, 8, 65.0 + (w * 1.5), 150),
            (prog_id, w, 2, bench_id, 4, 8, 65.0 + (w * 1.5), 120),
            (prog_id, w, 3, deadlift_id, 4, 6, 67.5 + (w * 1.5), 180);
        END LOOP;
        -- Фаза 2: Сила W7-W11
        FOR w IN 7..11 LOOP
            INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
            (prog_id, w, 1, squat_id, 5, 4, 78.0 + ((w - 6) * 2.0), 180),
            (prog_id, w, 2, bench_id, 5, 4, 78.0 + ((w - 6) * 2.0), 150),
            (prog_id, w, 3, deadlift_id, 4, 3, 80.0 + ((w - 6) * 2.0), 210);
        END LOOP;
        -- Фаза 3: Пик W12-W14
        FOR w IN 12..14 LOOP
            INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
            (prog_id, w, 1, squat_id, 3, 2, 90.0 + ((w - 11) * 4.0), 240),
            (prog_id, w, 2, bench_id, 3, 2, 90.0 + ((w - 11) * 4.0), 180),
            (prog_id, w, 3, deadlift_id, 2, 1, 92.0 + ((w - 11) * 4.0), 270);
        END LOOP;
    END IF;

    -- 7. 5/3/1 Powerlifting-версия (4 недели)
    SELECT id INTO prog_id FROM training_program WHERE name = '5/3/1 Джима Вендлера (Powerlifting-версия)';
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL AND squat_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        -- W1 (3x5 + Joker singles)
        INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
        (prog_id, 1, 1, squat_id, 1, 5, 65.0, 150), (prog_id, 1, 1, squat_id, 1, 5, 75.0, 180), (prog_id, 1, 1, squat_id, 1, 5, 85.0, 210),
        (prog_id, 1, 2, bench_id, 1, 5, 65.0, 120), (prog_id, 1, 2, bench_id, 1, 5, 75.0, 150), (prog_id, 1, 2, bench_id, 1, 5, 85.0, 180),
        (prog_id, 1, 3, deadlift_id, 1, 5, 65.0, 150), (prog_id, 1, 3, deadlift_id, 1, 5, 75.0, 180), (prog_id, 1, 3, deadlift_id, 1, 5, 85.0, 210),
        -- W2 (3x3 + Joker singles)
        (prog_id, 2, 1, squat_id, 1, 3, 70.0, 150), (prog_id, 2, 1, squat_id, 1, 3, 80.0, 180), (prog_id, 2, 1, squat_id, 1, 3, 90.0, 240),
        (prog_id, 2, 2, bench_id, 1, 3, 70.0, 120), (prog_id, 2, 2, bench_id, 1, 3, 80.0, 150), (prog_id, 2, 2, bench_id, 1, 3, 90.0, 210),
        (prog_id, 2, 3, deadlift_id, 1, 3, 70.0, 150), (prog_id, 2, 3, deadlift_id, 1, 3, 80.0, 180), (prog_id, 2, 3, deadlift_id, 1, 3, 90.0, 240),
        -- W3 (5/3/1 + Heavy Joker Singles)
        (prog_id, 3, 1, squat_id, 1, 5, 75.0, 180), (prog_id, 3, 1, squat_id, 1, 3, 85.0, 210), (prog_id, 3, 1, squat_id, 1, 1, 95.0, 270),
        (prog_id, 3, 2, bench_id, 1, 5, 75.0, 150), (prog_id, 3, 2, bench_id, 1, 3, 85.0, 180), (prog_id, 3, 2, bench_id, 1, 1, 95.0, 240),
        (prog_id, 3, 3, deadlift_id, 1, 5, 75.0, 180), (prog_id, 3, 3, deadlift_id, 1, 3, 85.0, 210), (prog_id, 3, 3, deadlift_id, 1, 1, 95.0, 270),
        -- W4 (Deload)
        (prog_id, 4, 1, squat_id, 3, 5, 50.0, 90),
        (prog_id, 4, 2, bench_id, 3, 5, 50.0, 90),
        (prog_id, 4, 3, deadlift_id, 3, 5, 50.0, 90);
    END IF;

    -- 8. Техасский метод для троеборья (4 недели)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Техасский метод (Texas Method — Троеборье)';
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL AND squat_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        FOR w IN 1..4 LOOP
            INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
            -- Понедельник (Объем): Присед 5х5 + Жим 5х5
            (prog_id, w, 1, squat_id, 5, 5, 75.0 + (w * 1.5), 180),
            (prog_id, w, 1, bench_id, 5, 5, 75.0 + (w * 1.5), 150),
            -- Среда (Восстановление): Присед 2х5 + Тяга легкая 3х3
            (prog_id, w, 2, squat_id, 2, 5, 60.0, 120),
            (prog_id, w, 2, deadlift_id, 3, 3, 65.0, 120),
            -- Пятница (Интенсивный рекорд): Присед 1х5 + Жим 1х5 + Тяга 1х5
            (prog_id, w, 3, squat_id, 1, 5, 87.5 + (w * 2.0), 240),
            (prog_id, w, 3, bench_id, 1, 5, 87.5 + (w * 2.0), 210),
            (prog_id, w, 3, deadlift_id, 1, 5, 87.5 + (w * 2.0), 240);
        END LOOP;
    END IF;

    -- 9. Candito 6 Week (Троеборье)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Candito 6 Week Strength Program (Троеборье)';
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL AND squat_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        FOR w IN 1..6 LOOP
            INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
            (prog_id, w, 1, squat_id, 4, 4, 70.0 + (w * 5.0), 180),
            (prog_id, w, 1, bench_id, 4, 4, 70.0 + (w * 5.0), 150),
            (prog_id, w, 2, deadlift_id, 3, 3, 72.5 + (w * 5.0), 210),
            (prog_id, w, 2, bench_id, 4, 4, 67.5 + (w * 5.0), 150);
        END LOOP;
    END IF;

    -- 10. Calgary Barbell (16 недель)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Calgary Barbell (16 недель)';
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL AND squat_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        FOR w IN 1..16 LOOP
            INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
            (prog_id, w, 1, squat_id, 4, 4, 68.0 + (w * 2.0), 180),
            (prog_id, w, 1, bench_id, 5, 4, 68.0 + (w * 2.0), 150),
            (prog_id, w, 2, deadlift_id, 4, 3, 70.0 + (w * 2.0), 210),
            (prog_id, w, 2, bench_id, 4, 3, 72.0 + (w * 2.0), 150),
            (prog_id, w, 3, squat_id, 3, 2, 75.0 + (w * 2.0), 210),
            (prog_id, w, 3, bench_id, 4, 2, 75.0 + (w * 2.0), 180);
        END LOOP;
    END IF;

    -- 11. The Cube Method — Троеборье (10 недель)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Метод Куба (The Cube Method — Троеборье)';
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL AND squat_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        FOR w IN 1..10 LOOP
            INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
            (prog_id, w, 1, squat_id, 5, 2, 75.0 + (w * 2.5), 180),
            (prog_id, w, 2, bench_id, 5, 3, 72.5 + (w * 2.5), 150),
            (prog_id, w, 3, deadlift_id, 4, 2, 77.5 + (w * 2.5), 210);
        END LOOP;
    END IF;

    -- 12. 9-недельный пиковый цикл TSA (9 недель)
    SELECT id INTO prog_id FROM training_program WHERE name = '9-недельный пиковый цикл TSA (The Strength Athlete)';
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL AND squat_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        FOR w IN 1..9 LOOP
            INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
            (prog_id, w, 1, squat_id, 4, 3, 72.0 + (w * 3.5), 180),
            (prog_id, w, 1, bench_id, 4, 3, 72.0 + (w * 3.5), 150),
            (prog_id, w, 2, deadlift_id, 3, 2, 75.0 + (w * 3.5), 210),
            (prog_id, w, 2, bench_id, 4, 3, 70.0 + (w * 3.0), 150);
        END LOOP;
    END IF;

    -- 13. Juggernaut Method 2.0 (16 недель)
    SELECT id INTO prog_id FROM training_program WHERE name = 'Juggernaut Method 2.0 (16 недель)';
    IF prog_id IS NOT NULL AND bench_id IS NOT NULL AND squat_id IS NOT NULL AND deadlift_id IS NOT NULL THEN
        FOR w IN 1..16 LOOP
            INSERT INTO program_workout_template (program_id, week_number, day_number, exercise_id, sets, reps, intensity_percentage, rest_seconds) VALUES
            (prog_id, w, 1, squat_id, 4, 5, 65.0 + (w * 2.0), 180),
            (prog_id, w, 2, bench_id, 4, 5, 65.0 + (w * 2.0), 150),
            (prog_id, w, 3, deadlift_id, 3, 4, 68.0 + (w * 2.0), 210);
        END LOOP;
    END IF;

END $$;
