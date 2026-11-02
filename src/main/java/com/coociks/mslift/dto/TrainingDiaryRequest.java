package com.coociks.mslift.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Schema(description = "Запрос на сохранение тренировочной сессии в дневник")
public record TrainingDiaryRequest(
    @NotBlank(message = "ID программы не может быть пустым")
    @Schema(description = "ID тренировочной программы", example = "bench-smolov-jr")
    String programId,

    @NotBlank(message = "Название программы обязательно")
    @Schema(description = "Название программы", example = "Жим лёжа: Смолов-младший")
    String programName,

    @NotNull(message = "Номер недели обязателен")
    @Min(value = 1, message = "Номер недели должен быть от 1")
    @Schema(description = "Номер недели цикла", example = "1")
    Integer weekNumber,

    @NotNull(message = "Номер дня обязателен")
    @Min(value = 1, message = "Номер дня должен быть от 1")
    @Schema(description = "Номер дня в неделе", example = "1")
    Integer dayNumber,

    @Schema(description = "Дата тренировки")
    LocalDate workoutDate,

    @Schema(description = "JSON-список базовых упражнений с весами")
    String baseExercises,

    @Schema(description = "JSON-список подсобных упражнений")
    String accessoryExercises,

    @Schema(description = "Заметки атлета о тренировке", example = "Отличная скорость на всех подходах")
    String notes
) {}
