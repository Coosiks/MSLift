package com.coociks.mslift.repository;

import com.coociks.mslift.entity.TrainingProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TrainingProgramRepository extends JpaRepository<TrainingProgram, UUID> {
    List<TrainingProgram> findByMovementCategory(String movementCategory);
    List<TrainingProgram> findByMovementCategoryIn(List<String> movementCategories);
}