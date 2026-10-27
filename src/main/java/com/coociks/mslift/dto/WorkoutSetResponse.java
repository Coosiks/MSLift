package com.coociks.mslift.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record WorkoutSetResponse(
    UUID id,
    UUID exerciseId,
    String exerciseName,
    BigDecimal weightKg,
    Integer reps,
    Integer rpe,
    LocalDate workoutDate,
    BigDecimal estimatedOneRmEpley,    
    BigDecimal estimatedOneRmBrzycki   
) {}