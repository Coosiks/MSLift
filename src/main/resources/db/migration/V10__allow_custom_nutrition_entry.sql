-- =========================================================================
-- V10: РАЗРЕШАЕМ ПОЛЬЗОВАТЕЛЬСКИЕ БЛЮДА И ПРИЁМЫ ПИЩИ В ДНЕВНИКЕ КБЖУ
-- =========================================================================

-- Разрешаем отсутствие связанного food_product_id для ручного ввода блюд
ALTER TABLE nutrition_entry ALTER COLUMN food_product_id DROP NOT NULL;

-- Разрешаем отсутствие веса в граммах (по умолчанию 0 или произвольная порция)
ALTER TABLE nutrition_entry ALTER COLUMN weight_grams DROP NOT NULL;

-- Добавляем название пользовательского блюда и категорию приёма пищи
ALTER TABLE nutrition_entry ADD COLUMN IF NOT EXISTS custom_food_name VARCHAR(255);
ALTER TABLE nutrition_entry ADD COLUMN IF NOT EXISTS meal_type VARCHAR(50) DEFAULT 'Основной';
