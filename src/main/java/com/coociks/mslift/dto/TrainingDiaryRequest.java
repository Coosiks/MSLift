package com.coociks.mslift.dto;

import java.time.LocalDate;
import java.util.UUID;

public record TrainingDiaryRequest(
    String programId,
    String programName,
    Integer weekNumber,
    Integer dayNumber,
    LocalDate workoutDate,
    String baseExercises,
    String accessoryExercises,
    String notes
) {}
