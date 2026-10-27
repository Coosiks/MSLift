package com.coociks.mslift.repository;

import com.coociks.mslift.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {
}
