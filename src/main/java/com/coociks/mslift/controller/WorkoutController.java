package com.coociks.mslift.controller;

import com.coociks.mslift.dto.TrainingDiaryRequest;
import com.coociks.mslift.dto.TrainingDiaryResponse;
import com.coociks.mslift.dto.WorkoutSetRequest;
import com.coociks.mslift.dto.WorkoutSetResponse;
import com.coociks.mslift.dto.WorkoutStatsResponse;
import com.coociks.mslift.entity.Exercise;
import com.coociks.mslift.repository.ExerciseRepository;
import com.coociks.mslift.service.WorkoutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
@Tag(name = "Workout Diary", description = "Дневник тренировок — запись подходов и история")
public class WorkoutController {

    private final WorkoutService workoutService;
    private final ExerciseRepository exerciseRepository;

    @GetMapping("/exercises")
    @Operation(
        summary = "Получить список упражнений",
        description = "Возвращает справочник всех доступных упражнений"
    )
    public ResponseEntity<List<Exercise>> getAllExercises() {
        return ResponseEntity.ok(exerciseRepository.findAll());
    }

    @PostMapping("/sets")
    @Operation(
        summary = "Добавить подход",
        description = "Записывает подход в дневник и автоматически рассчитывает 1ПМ"
    )
    public ResponseEntity<WorkoutSetResponse> addSet(
            @Parameter(description = "Данные подхода: упражнение, вес, повторения, RPE")
            @RequestBody WorkoutSetRequest request) {
        return ResponseEntity.ok(workoutService.addWorkoutSet(request));
    }

    @GetMapping("/sets")
    @Operation(
        summary = "Получить историю подходов",
        description = "Возвращает историю подходов по конкретному упражнению"
    )
    public ResponseEntity<List<WorkoutSetResponse>> getHistory(
            @Parameter(description = "ID упражнения")
            @RequestParam UUID exerciseId) {
        return ResponseEntity.ok(workoutService.getExerciseHistory(exerciseId));
    }

    @GetMapping("/stats/{exerciseId}")
    @Operation(
        summary = "Получить статистику по упражнению",
        description = "Возвращает личные рекорды (PR), общий тоннаж и количество подходов"
    )
    public ResponseEntity<WorkoutStatsResponse> getStats(
            @Parameter(description = "ID упражнения")
            @PathVariable UUID exerciseId) {
        return ResponseEntity.ok(workoutService.getExerciseStats(exerciseId));
    }

    @PostMapping("/diary")
    @Operation(
        summary = "Записать тренировочный день в дневник",
        description = "Сохраняет программу, базовые упражнения и добавленную подсобку"
    )
    public ResponseEntity<TrainingDiaryResponse> addDiaryEntry(@RequestBody TrainingDiaryRequest request) {
        return ResponseEntity.ok(workoutService.addDiaryEntry(request));
    }

    @GetMapping("/diary")
    @Operation(
        summary = "Получить историю записей дневника",
        description = "Возвращает историю завершенных тренировок с базой и подсобкой"
    )
    public ResponseEntity<List<TrainingDiaryResponse>> getDiaryEntries() {
        return ResponseEntity.ok(workoutService.getDiaryEntries());
    }

    @DeleteMapping("/diary/{id}")
    @Operation(
        summary = "Удалить запись из дневника",
        description = "Удаляет сохраненную тренировку по её ID"
    )
    public ResponseEntity<Void> deleteDiaryEntry(@PathVariable UUID id) {
        workoutService.deleteDiaryEntry(id);
        return ResponseEntity.noContent().build();
    }
}