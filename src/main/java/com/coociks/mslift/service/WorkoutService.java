package com.coociks.mslift.service;

import com.coociks.mslift.dto.WorkoutSetRequest;
import com.coociks.mslift.dto.WorkoutSetResponse;
import com.coociks.mslift.dto.WorkoutStatsResponse;
import com.coociks.mslift.entity.Exercise;
import com.coociks.mslift.entity.WorkoutSet;
import com.coociks.mslift.repository.ExerciseRepository;
import com.coociks.mslift.repository.WorkoutSetRepository;
import com.coociks.mslift.dto.TrainingDiaryRequest;
import com.coociks.mslift.dto.TrainingDiaryResponse;
import com.coociks.mslift.entity.TrainingDiaryEntry;
import com.coociks.mslift.repository.TrainingDiaryEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutSetRepository workoutSetRepository;
    private final ExerciseRepository exerciseRepository;
    private final TrainingDiaryEntryRepository diaryEntryRepository;
    private final OneRepMaxCalculator oneRepMaxCalculator;

    @Transactional
    public WorkoutSetResponse addWorkoutSet(WorkoutSetRequest request) {
        Exercise exercise = exerciseRepository.findById(request.exerciseId())
                .orElseThrow(() -> new RuntimeException("Упражнение не найдено"));

        WorkoutSet workoutSet = WorkoutSet.builder()
                .exercise(exercise)
                .weightKg(request.weightKg())
                .reps(request.reps())
                .rpe(request.rpe())
                .workoutDate(request.workoutDate() != null ? request.workoutDate() : LocalDate.now())
                .build();

        WorkoutSet savedSet = workoutSetRepository.save(workoutSet);

        // Сразу рассчитываем предполагаемый 1ПМ для этого подхода
        BigDecimal epley = oneRepMaxCalculator.calculateEpley(savedSet.getWeightKg(), savedSet.getReps());
        BigDecimal brzycki = oneRepMaxCalculator.calculateBrzycki(savedSet.getWeightKg(), savedSet.getReps());

        return new WorkoutSetResponse(
                savedSet.getId(),
                savedSet.getExercise().getId(),
                savedSet.getExercise().getName(),
                savedSet.getWeightKg(),
                savedSet.getReps(),
                savedSet.getRpe(),
                savedSet.getWorkoutDate(),
                epley,
                brzycki
        );
    }

    @Transactional(readOnly = true)
    public List<WorkoutSetResponse> getExerciseHistory(UUID exerciseId) {
        return workoutSetRepository.findByExerciseIdOrderByDateDesc(exerciseId).stream()
                .map(ws -> new WorkoutSetResponse(
                        ws.getId(),
                        ws.getExercise().getId(),
                        ws.getExercise().getName(),
                        ws.getWeightKg(),
                        ws.getReps(),
                        ws.getRpe(),
                        ws.getWorkoutDate(),
                        oneRepMaxCalculator.calculateEpley(ws.getWeightKg(), ws.getReps()),
                        oneRepMaxCalculator.calculateBrzycki(ws.getWeightKg(), ws.getReps())
                ))
                .toList();
    }

        @Transactional(readOnly = true)
    public WorkoutStatsResponse getExerciseStats(UUID exerciseId) {
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("Упражнение не найдено"));

        BigDecimal maxWeight = workoutSetRepository.findMaxWeightByExerciseId(exerciseId).orElse(BigDecimal.ZERO);
        Long totalSets = workoutSetRepository.countSetsByExerciseId(exerciseId);
        BigDecimal totalVolume = workoutSetRepository.findTotalVolumeByExerciseId(exerciseId).orElse(BigDecimal.ZERO);

        // Получаем самый тяжелый подход, чтобы узнать повторения и рассчитать 1ПМ именно для него
        WorkoutSet heaviestSet = workoutSetRepository.findTopSetsByExerciseId(exerciseId, org.springframework.data.domain.PageRequest.of(0, 1))
                .stream().findFirst().orElse(null);

        BigDecimal maxOneRmEpley = BigDecimal.ZERO;
        BigDecimal maxOneRmBrzycki = BigDecimal.ZERO;
        Integer maxWeightReps = 0;

        if (heaviestSet != null) {
            maxWeightReps = heaviestSet.getReps();
            maxOneRmEpley = oneRepMaxCalculator.calculateEpley(heaviestSet.getWeightKg(), heaviestSet.getReps());
            maxOneRmBrzycki = oneRepMaxCalculator.calculateBrzycki(heaviestSet.getWeightKg(), heaviestSet.getReps());
        }

        return new WorkoutStatsResponse(
                exerciseId,
                exercise.getName(),
                maxWeight,
                maxWeightReps,
                maxOneRmEpley,
                maxOneRmBrzycki,
                totalSets,
                totalVolume
        );
    }

    @Transactional
    public TrainingDiaryResponse addDiaryEntry(TrainingDiaryRequest request) {
        UUID progUuid = null;
        if (request.programId() != null && !request.programId().isBlank()) {
            try {
                progUuid = UUID.fromString(request.programId());
            } catch (IllegalArgumentException ignored) {
                // Not a valid UUID, leave as null
            }
        }

        TrainingDiaryEntry entry = TrainingDiaryEntry.builder()
                .programId(progUuid)
                .programName(request.programName() != null ? request.programName() : "Тренировка")
                .weekNumber(request.weekNumber() != null ? request.weekNumber() : 1)
                .dayNumber(request.dayNumber() != null ? request.dayNumber() : 1)
                .workoutDate(request.workoutDate() != null ? request.workoutDate() : LocalDate.now())
                .baseExercises(request.baseExercises() != null ? request.baseExercises() : "[]")
                .accessoryExercises(request.accessoryExercises() != null ? request.accessoryExercises() : "[]")
                .notes(request.notes())
                .build();

        TrainingDiaryEntry saved = diaryEntryRepository.save(entry);

        return mapToDiaryResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<TrainingDiaryResponse> getDiaryEntries() {
        return diaryEntryRepository.findAllByOrderByWorkoutDateDescCreatedAtDesc()
                .stream()
                .map(this::mapToDiaryResponse)
                .toList();
    }

    @Transactional
    public void deleteDiaryEntry(UUID id) {
        diaryEntryRepository.deleteById(id);
    }

    private TrainingDiaryResponse mapToDiaryResponse(TrainingDiaryEntry entry) {
        return new TrainingDiaryResponse(
                entry.getId(),
                entry.getProgramId(),
                entry.getProgramName(),
                entry.getWeekNumber(),
                entry.getDayNumber(),
                entry.getWorkoutDate(),
                entry.getBaseExercises(),
                entry.getAccessoryExercises(),
                entry.getNotes(),
                entry.getCreatedAt()
        );
    }
}