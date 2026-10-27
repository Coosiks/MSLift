package com.coociks.mslift.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record NutritionEntryRequest(
    UUID foodProductId,
    String foodName,
    Integer weightGrams,
    BigDecimal calories,
    BigDecimal protein,
    BigDecimal fat,
    BigDecimal carbs,
    String mealType,
    LocalDate entryDate 
) {}