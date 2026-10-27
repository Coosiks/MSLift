package com.coociks.mslift.repository;

import com.coociks.mslift.entity.ProgramWorkoutTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ProgramWorkoutTemplateRepository extends JpaRepository<ProgramWorkoutTemplate, UUID> {
    List<ProgramWorkoutTemplate> findByProgramIdAndWeekNumberOrderByDayNumberAsc(UUID programId, Integer weekNumber);
    List<ProgramWorkoutTemplate> findByProgramIdOrderByWeekNumberAscDayNumberAsc(UUID programId);
}