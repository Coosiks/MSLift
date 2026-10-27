package com.coociks.mslift.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record WorkoutSetRequest(
    UUID exerciseId,
    BigDecimal weightKg,
    Integer reps,
    Integer rpe,
    LocalDate workoutDate 
) {}