package com.coociks.mslift.dto;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record TrainingDiaryResponse(
    UUID id,
    UUID programId,
    String programName,
    Integer weekNumber,
    Integer dayNumber,
    LocalDate workoutDate,
    String baseExercises,
    String accessoryExercises,
    String notes,
    OffsetDateTime createdAt
) {}
