package com.coociks.mslift.repository;

import com.coociks.mslift.entity.TrainingDiaryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TrainingDiaryEntryRepository extends JpaRepository<TrainingDiaryEntry, UUID> {
    List<TrainingDiaryEntry> findAllByOrderByWorkoutDateDescCreatedAtDesc();
}
