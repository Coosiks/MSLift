package com.coociks.mslift.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "training_diary_entry")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingDiaryEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "program_id")
    private UUID programId;

    @Column(name = "program_name", nullable = false)
    private String programName;

    @Column(name = "week_number", nullable = false)
    private Integer weekNumber;

    @Column(name = "day_number", nullable = false)
    private Integer dayNumber;

    @Column(name = "workout_date", nullable = false)
    private LocalDate workoutDate;

    @Column(name = "base_exercises", nullable = false, columnDefinition = "TEXT")
    private String baseExercises;

    @Column(name = "accessory_exercises", columnDefinition = "TEXT")
    private String accessoryExercises;

    @Column(name = "notes")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
        if (workoutDate == null) {
            workoutDate = LocalDate.now();
        }
    }
}
