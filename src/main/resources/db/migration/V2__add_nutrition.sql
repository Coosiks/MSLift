-- Справочник продуктов (КБЖУ на 100 грамм)
CREATE TABLE food_product (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    calories_per_100g DECIMAL(8, 2) NOT NULL,
    protein_per_100g DECIMAL(8, 2) NOT NULL,
    fat_per_100g DECIMAL(8, 2) NOT NULL,
    carbs_per_100g DECIMAL(8, 2) NOT NULL
);

-- Дневник питания (конкретная запись приема пищи)
CREATE TABLE nutrition_entry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    food_product_id UUID NOT NULL REFERENCES food_product(id) ON DELETE CASCADE,
    weight_grams INT NOT NULL,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_calories DECIMAL(8, 2) NOT NULL,
    total_protein DECIMAL(8, 2) NOT NULL,
    total_fat DECIMAL(8, 2) NOT NULL,
    total_carbs DECIMAL(8, 2) NOT NULL
);

-- Индекс для быстрого получения статистики за день
CREATE INDEX idx_nutrition_entry_date ON nutrition_entry(entry_date);

-- Добавляем базовые продукты для старта
INSERT INTO food_product (name, calories_per_100g, protein_per_100g, fat_per_100g, carbs_per_100g) VALUES 
('Куриная грудка (вареная)', 165.0, 31.0, 3.6, 0.0),
('Рис белый (вареный)', 130.0, 2.7, 0.3, 28.0),
('Яйцо куриное', 155.0, 13.0, 11.0, 1.1),
('Овсянка на воде', 88.0, 3.0, 1.7, 15.0),
('Творог 5%', 121.0, 17.0, 5.0, 1.8);
