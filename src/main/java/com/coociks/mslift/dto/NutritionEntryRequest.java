package com.coociks.mslift.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Schema(description = "Запрос на добавление блюда или продукта в дневник питания")
public record NutritionEntryRequest(
    @Schema(description = "ID продукта из базы (опционально, если выбран готовый продукт)")
    UUID foodProductId,

    @Schema(description = "Пользовательское название блюда/продукта", example = "Творог 5% с черникой")
    String foodName,

    @Positive(message = "Вес порции должен быть положительным числом грамм")
    @Schema(description = "Вес порции в граммах", example = "200")
    Integer weightGrams,

    @PositiveOrZero(message = "Калории не могут быть отрицательными")
    @Schema(description = "Калорийность порции (если не указана — рассчитывается автоматически)", example = "250.0")
    BigDecimal calories,

    @PositiveOrZero(message = "Количество белков не может быть отрицательным")
    @Schema(description = "Белки в граммах", example = "30.0")
    BigDecimal protein,

    @PositiveOrZero(message = "Количество жиров не может быть отрицательным")
    @Schema(description = "Жиры в граммах", example = "5.0")
    BigDecimal fat,

    @PositiveOrZero(message = "Количество углеводов не может быть отрицательным")
    @Schema(description = "Углеводы в граммах", example = "20.0")
    BigDecimal carbs,

    @Schema(description = "Тип приёма пищи (Завтрак, Обед, Ужин, Перекус)", example = "Завтрак")
    String mealType,

    @Schema(description = "Дата приёма пищи (по умолчанию сегодня)")
    LocalDate entryDate 
) {}