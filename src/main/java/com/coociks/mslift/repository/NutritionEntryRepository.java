package com.coociks.mslift.repository;

import com.coociks.mslift.entity.NutritionEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface NutritionEntryRepository extends JpaRepository<NutritionEntry, UUID> {
    
    @Query("SELECT ne FROM NutritionEntry ne LEFT JOIN FETCH ne.foodProduct WHERE ne.entryDate = :date ORDER BY ne.id DESC")
    List<NutritionEntry> findByEntryDate(@Param("date") LocalDate date);
}