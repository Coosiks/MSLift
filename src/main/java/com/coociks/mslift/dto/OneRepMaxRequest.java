package com.coociks.mslift.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

@Schema(description = "Запрос на расчёт одноповторного максимума (1ПМ)")
public record OneRepMaxRequest(
    @NotNull(message = "Вес снаряда обязателен для расчёта")
    @Positive(message = "Вес снаряда должен быть строго больше 0 кг")
    @Schema(description = "Поднятый вес в килограммах", example = "100.0")
    BigDecimal weight,

    @Min(value = 1, message = "Количество повторений должно быть не менее 1")
    @Max(value = 36, message = "Формулы расчёта 1ПМ валидны до 36 повторений включительно")
    @Schema(description = "Число выполненных повторений (от 1 до 36)", example = "5")
    int reps,

    @Schema(description = "Формула расчёта (EPLEY или BRZYCKI)", example = "EPLEY")
    String formula
) {}