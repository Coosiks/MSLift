-- 1. Создаём таблицу пользователей
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Добавляем тестового пользователя (пароль: test123, захеширован BCrypt)
INSERT INTO users (username, password_hash) VALUES 
('test_user', '$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

-- 3. Добавляем поле user_id в существующие таблицы (сначала разрешаем NULL)
ALTER TABLE workout_set ADD COLUMN user_id UUID;
ALTER TABLE nutrition_entry ADD COLUMN user_id UUID;

-- 4. Привязываем ВСЕ существующие записи к нашему тестовому пользователю
UPDATE workout_set SET user_id = (SELECT id FROM users WHERE username = 'test_user');
UPDATE nutrition_entry SET user_id = (SELECT id FROM users WHERE username = 'test_user');

-- 5. Делаем поле обязательным и добавляем индексы для быстрого поиска
ALTER TABLE workout_set ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE nutrition_entry ALTER COLUMN user_id SET NOT NULL;

CREATE INDEX idx_workout_set_user_id ON workout_set(user_id);
CREATE INDEX idx_nutrition_entry_user_id ON nutrition_entry(user_id);
