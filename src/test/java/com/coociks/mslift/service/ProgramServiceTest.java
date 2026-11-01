package com.coociks.mslift.service;

import com.coociks.mslift.repository.ProgramWorkoutTemplateRepository;
import com.coociks.mslift.repository.WorkoutSetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
@DisplayName("Тесты логики подбора 1ПМ в ProgramService")
class ProgramServiceTest {

    @Mock
    private ProgramWorkoutTemplateRepository templateRepository;

    @Mock
    private WorkoutSetRepository workoutSetRepository;

    @Mock
    private OneRepMaxCalculator oneRepMaxCalculator;

    private ProgramService programService;

    @BeforeEach
    void setUp() {
        programService = new ProgramService(templateRepository, workoutSetRepository, oneRepMaxCalculator);
    }

    @Test
    @DisplayName("Присед: выбирается переданный squat1Rm")
    void resolveOneRm_forSquat_picksSquatOneRm() {
        BigDecimal squatRm = BigDecimal.valueOf(175.0);
        BigDecimal benchRm = BigDecimal.valueOf(120.0);
        BigDecimal deadliftRm = BigDecimal.valueOf(210.0);

        BigDecimal resolved = programService.resolveOneRmForExercise(
                UUID.randomUUID(),
                "Приседания со штангой на спине",
                null,
                benchRm,
                squatRm,
                deadliftRm
        );

        assertEquals(squatRm, resolved);
    }

    @Test
    @DisplayName("Жим: выбирается переданный bench1Rm")
    void resolveOneRm_forBench_picksBenchOneRm() {
        BigDecimal squatRm = BigDecimal.valueOf(175.0);
        BigDecimal benchRm = BigDecimal.valueOf(120.0);
        BigDecimal deadliftRm = BigDecimal.valueOf(210.0);

        BigDecimal resolved = programService.resolveOneRmForExercise(
                UUID.randomUUID(),
                "Жим штанги лёжа соревновательный",
                null,
                benchRm,
                squatRm,
                deadliftRm
        );

        assertEquals(benchRm, resolved);
    }

    @Test
    @DisplayName("Тяга: выбирается переданный deadlift1Rm")
    void resolveOneRm_forDeadlift_picksDeadliftOneRm() {
        BigDecimal squatRm = BigDecimal.valueOf(175.0);
        BigDecimal benchRm = BigDecimal.valueOf(120.0);
        BigDecimal deadliftRm = BigDecimal.valueOf(210.0);

        BigDecimal resolved = programService.resolveOneRmForExercise(
                UUID.randomUUID(),
                "Становая тяга классическая",
                null,
                benchRm,
                squatRm,
                deadliftRm
        );

        assertEquals(deadliftRm, resolved);
    }

    @Test
    @DisplayName("Одиночная программа: при отсутствии тройки выбирается customOneRm")
    void resolveOneRm_picksCustomOneRm_whenSpecified() {
        BigDecimal customRm = BigDecimal.valueOf(115.0);

        BigDecimal resolved = programService.resolveOneRmForExercise(
                null,
                "Жим лёжа узким хватом",
                customRm,
                null,
                null,
                null
        );

        assertEquals(customRm, resolved);
    }

    @Test
    @DisplayName("Дефолтные веса при отсутствии входных данных")
    void resolveOneRm_defaults_whenNoDataProvided() {
        BigDecimal resolvedSquat = programService.resolveOneRmForExercise(null, "Приседания", null, null, null, null);
        BigDecimal resolvedBench = programService.resolveOneRmForExercise(null, "Жим лежа", null, null, null, null);
        BigDecimal resolvedDeadlift = programService.resolveOneRmForExercise(null, "Становая тяга", null, null, null, null);

        assertEquals(BigDecimal.valueOf(140.0), resolvedSquat);
        assertEquals(BigDecimal.valueOf(100.0), resolvedBench);
        assertEquals(BigDecimal.valueOf(160.0), resolvedDeadlift);
    }
}
