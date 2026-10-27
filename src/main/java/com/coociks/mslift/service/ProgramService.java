package com.coociks.mslift.service;

import com.coociks.mslift.dto.ProgramWeekResponse;
import com.coociks.mslift.entity.ProgramWorkoutTemplate;
import com.coociks.mslift.entity.WorkoutSet;
import com.coociks.mslift.repository.ProgramWorkoutTemplateRepository;
import com.coociks.mslift.repository.WorkoutSetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProgramService {

    private final ProgramWorkoutTemplateRepository templateRepository;
    private final WorkoutSetRepository workoutSetRepository;
    private final OneRepMaxCalculator oneRepMaxCalculator;

    @Transactional(readOnly = true)
    public List<ProgramWeekResponse> getProgramWeek(UUID programId, Integer weekNumber, UUID exerciseId, 
                                                   BigDecimal customOneRm, BigDecimal bench1Rm, 
                                                   BigDecimal squat1Rm, BigDecimal deadlift1Rm) {
        List<ProgramWorkoutTemplate> templates = templateRepository
                .findByProgramIdAndWeekNumberOrderByDayNumberAsc(programId, weekNumber);

        return templates.stream()
                .filter(t -> exerciseId == null || t.getExercise().getId().equals(exerciseId))
                .map(t -> {
                    BigDecimal targetOneRm = resolveOneRmForExercise(t.getExercise().getId(), t.getExercise().getName(), customOneRm, bench1Rm, squat1Rm, deadlift1Rm);
                    return mapToResponse(t, targetOneRm);
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProgramWeekResponse> getFullProgram(UUID programId, UUID exerciseId, 
                                                   BigDecimal customOneRm, BigDecimal bench1Rm, 
                                                   BigDecimal squat1Rm, BigDecimal deadlift1Rm) {
        List<ProgramWorkoutTemplate> templates = templateRepository
                .findByProgramIdOrderByWeekNumberAscDayNumberAsc(programId);

        return templates.stream()
                .filter(t -> exerciseId == null || t.getExercise().getId().equals(exerciseId))
                .map(t -> {
                    BigDecimal targetOneRm = resolveOneRmForExercise(t.getExercise().getId(), t.getExercise().getName(), customOneRm, bench1Rm, squat1Rm, deadlift1Rm);
                    return mapToResponse(t, targetOneRm);
                })
                .toList();
    }

    public BigDecimal resolveOneRmForExercise(UUID exerciseId, String exerciseName, 
                                              BigDecimal customOneRm, BigDecimal bench1Rm, 
                                              BigDecimal squat1Rm, BigDecimal deadlift1Rm) {
        String lowerName = (exerciseName != null) ? exerciseName.toLowerCase() : "";

        if (lowerName.contains("присед") || lowerName.contains("squat")) {
            if (squat1Rm != null && squat1Rm.compareTo(BigDecimal.ZERO) > 0) return squat1Rm;
            if (customOneRm != null && customOneRm.compareTo(BigDecimal.ZERO) > 0) return customOneRm;
            BigDecimal historyMax = (exerciseId != null) ? getCurrentOneRm(exerciseId) : null;
            return (historyMax != null && historyMax.compareTo(BigDecimal.ZERO) > 0) ? historyMax : BigDecimal.valueOf(140.0);
        }

        if (lowerName.contains("тяг") || lowerName.contains("deadlift")) {
            if (deadlift1Rm != null && deadlift1Rm.compareTo(BigDecimal.ZERO) > 0) return deadlift1Rm;
            if (customOneRm != null && customOneRm.compareTo(BigDecimal.ZERO) > 0) return customOneRm;
            BigDecimal historyMax = (exerciseId != null) ? getCurrentOneRm(exerciseId) : null;
            return (historyMax != null && historyMax.compareTo(BigDecimal.ZERO) > 0) ? historyMax : BigDecimal.valueOf(160.0);
        }

        if (lowerName.contains("жим") || lowerName.contains("bench")) {
            if (bench1Rm != null && bench1Rm.compareTo(BigDecimal.ZERO) > 0) return bench1Rm;
            if (customOneRm != null && customOneRm.compareTo(BigDecimal.ZERO) > 0) return customOneRm;
            BigDecimal historyMax = (exerciseId != null) ? getCurrentOneRm(exerciseId) : null;
            return (historyMax != null && historyMax.compareTo(BigDecimal.ZERO) > 0) ? historyMax : BigDecimal.valueOf(100.0);
        }

        // Generic fallback
        if (customOneRm != null && customOneRm.compareTo(BigDecimal.ZERO) > 0) return customOneRm;
        if (exerciseId != null) {
            BigDecimal historyMax = getCurrentOneRm(exerciseId);
            if (historyMax != null && historyMax.compareTo(BigDecimal.ZERO) > 0) return historyMax;
        }
        return BigDecimal.valueOf(100.0);
    }

    // Overloaded backward-compatible methods
    @Transactional(readOnly = true)
    public List<ProgramWeekResponse> getProgramWeek(UUID programId, Integer weekNumber, UUID exerciseId, BigDecimal customOneRm) {
        return getProgramWeek(programId, weekNumber, exerciseId, customOneRm, null, null, null);
    }

    @Transactional(readOnly = true)
    public List<ProgramWeekResponse> getFullProgram(UUID programId, UUID exerciseId, BigDecimal customOneRm) {
        return getFullProgram(programId, exerciseId, customOneRm, null, null, null);
    }

    public BigDecimal resolveOneRm(UUID exerciseId, BigDecimal customOneRm) {
        return resolveOneRmForExercise(exerciseId, null, customOneRm, null, null, null);
    }

    public BigDecimal getCurrentOneRm(UUID exerciseId) {
        List<WorkoutSet> history = workoutSetRepository.findByExerciseIdOrderByDateDesc(exerciseId);

        return history.stream()
                .map(ws -> oneRepMaxCalculator.calculateEpley(ws.getWeightKg(), ws.getReps()))
                .max(BigDecimal::compareTo)
                .orElse(null);
    }

    private ProgramWeekResponse mapToResponse(ProgramWorkoutTemplate t, BigDecimal oneRm) {
        BigDecimal calculatedWeight = oneRm
                .multiply(t.getIntensityPercentage())
                .divide(BigDecimal.valueOf(100), 1, RoundingMode.HALF_UP);

        return new ProgramWeekResponse(
                t.getProgram().getId(),
                t.getProgram().getName(),
                t.getWeekNumber(),
                t.getDayNumber(),
                t.getExercise().getId(),
                t.getExercise().getName(),
                t.getSets(),
                t.getReps(),
                t.getIntensityPercentage(),
                calculatedWeight,
                t.getRestSeconds() != null ? t.getRestSeconds() : 120
        );
    }
}