package com.coociks.mslift.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record WorkoutStatsResponse(
    UUID exerciseId,
    String exerciseName,
    BigDecimal maxWeight,
    Integer maxWeightReps,
    BigDecimal maxOneRmEpley,
    BigDecimal maxOneRmBrzycki,
    Long totalSetsCount,
    BigDecimal totalVolume
) {}