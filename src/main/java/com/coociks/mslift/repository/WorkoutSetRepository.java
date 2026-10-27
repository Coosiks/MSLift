package com.coociks.mslift.repository;

import com.coociks.mslift.entity.WorkoutSet;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WorkoutSetRepository extends JpaRepository<WorkoutSet, UUID> {
    
    @Query("SELECT ws FROM WorkoutSet ws JOIN FETCH ws.exercise WHERE ws.exercise.id = :exerciseId ORDER BY ws.workoutDate DESC, ws.createdAt DESC")
    List<WorkoutSet> findByExerciseIdOrderByDateDesc(@Param("exerciseId") UUID exerciseId);

    @Query("SELECT MAX(ws.weightKg) FROM WorkoutSet ws WHERE ws.exercise.id = :exerciseId")
    Optional<BigDecimal> findMaxWeightByExerciseId(@Param("exerciseId") UUID exerciseId);

    @Query("SELECT COUNT(ws) FROM WorkoutSet ws WHERE ws.exercise.id = :exerciseId")
    Long countSetsByExerciseId(@Param("exerciseId") UUID exerciseId);

    @Query("SELECT SUM(ws.weightKg * ws.reps) FROM WorkoutSet ws WHERE ws.exercise.id = :exerciseId")
    Optional<BigDecimal> findTotalVolumeByExerciseId(@Param("exerciseId") UUID exerciseId);

    @Query("SELECT ws FROM WorkoutSet ws WHERE ws.exercise.id = :exerciseId ORDER BY ws.weightKg DESC, ws.reps DESC")
    List<WorkoutSet> findTopSetsByExerciseId(@Param("exerciseId") UUID exerciseId, Pageable pageable);
}