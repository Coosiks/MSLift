package com.coociks.mslift.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "training_program")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingProgram {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "duration_weeks", nullable = false)
    private Integer durationWeeks;

    @Column(name = "movement_category")
    private String movementCategory; // "BENCH", "SQUAT", "DEADLIFT", "UNIVERSAL"

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;
}