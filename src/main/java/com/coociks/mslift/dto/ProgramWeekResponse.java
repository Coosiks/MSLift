package com.coociks.mslift.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ProgramWeekResponse(
    UUID programId,
    String programName,
    Integer weekNumber,
    Integer dayNumber,
    UUID exerciseId,
    String exerciseName,
    Integer sets,
    Integer reps,
    BigDecimal intensityPercentage,
    BigDecimal calculatedWeightKg,
    Integer restSeconds
) {}