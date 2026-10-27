package com.coociks.mslift.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "program_workout_template")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgramWorkoutTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private TrainingProgram program;

    @Column(name = "week_number", nullable = false)
    private Integer weekNumber;

    @Column(name = "day_number", nullable = false)
    private Integer dayNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Column(name = "sets", nullable = false)
    private Integer sets;

    @Column(name = "reps", nullable = false)
    private Integer reps;

    @Column(name = "intensity_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal intensityPercentage;

    @Column(name = "rest_seconds")
    private Integer restSeconds;
}