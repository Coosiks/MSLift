package com.coociks.mslift.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record DailyNutritionResponse(
    List<NutritionEntryDto> entries,
    BigDecimal totalCalories,
    BigDecimal totalProtein,
    BigDecimal totalFat,
    BigDecimal totalCarbs
) {
    public record NutritionEntryDto(
        UUID id,
        String productName,
        Integer weightGrams,
        BigDecimal calories,
        BigDecimal protein,
        BigDecimal fat,
        BigDecimal carbs,
        String mealType
    ) {}
}