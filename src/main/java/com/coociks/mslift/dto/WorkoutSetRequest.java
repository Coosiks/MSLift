package com.coociks.mslift.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Schema(description = "Запрос на сохранение выполненного подхода")
public record WorkoutSetRequest(
    @NotNull(message = "ID упражнения обязателен")
    @Schema(description = "Уникальный ID упражнения")
    UUID exerciseId,

    @NotNull(message = "Вес снаряда обязателен")
    @Positive(message = "Вес снаряда должен быть строго больше 0 кг")
    @Schema(description = "Рабочий вес в кг", example = "140.0")
    BigDecimal weightKg,

    @NotNull(message = "Количество повторений обязательно")
    @Min(value = 1, message = "Повторений должно быть не менее 1")
    @Schema(description = "Количество повторений", example = "5")
    Integer reps,

    @Min(value = 1, message = "Шкала RPE от 1 до 10")
    @Max(value = 10, message = "Шкала RPE от 1 до 10")
    @Schema(description = "Субъективная оценка усилия (RPE 1-10)", example = "8")
    Integer rpe,

    @Schema(description = "Дата тренировки")
    LocalDate workoutDate 
) {}