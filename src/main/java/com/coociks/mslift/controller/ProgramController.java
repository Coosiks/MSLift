package com.coociks.mslift.controller;

import com.coociks.mslift.dto.ProgramWeekResponse;
import com.coociks.mslift.entity.TrainingProgram;
import com.coociks.mslift.repository.TrainingProgramRepository;
import com.coociks.mslift.service.ProgramService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/programs")
@RequiredArgsConstructor
@Tag(name = "Training Programs", description = "Тренировочные программы и генерация весов")
public class ProgramController {

    private final ProgramService programService;
    private final TrainingProgramRepository programRepository;

    @GetMapping
    @Operation(
        summary = "Получить список всех программ",
        description = "Возвращает справочник доступных тренировочных программ с возможностью фильтрации по категории (BENCH, SQUAT, DEADLIFT, POWERLIFTING)"
    )
    public ResponseEntity<List<TrainingProgram>> getAllPrograms(
            @Parameter(description = "Категория движения: BENCH, SQUAT, DEADLIFT, POWERLIFTING")
            @RequestParam(required = false) String category) {
        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("ALL")) {
            String upper = category.trim().toUpperCase();
            if ("UNIVERSAL".equals(upper)) {
                upper = "POWERLIFTING";
            }
            return ResponseEntity.ok(programRepository.findByMovementCategory(upper));
        }
        return ResponseEntity.ok(programRepository.findAll());
    }

    @GetMapping("/{programId}")
    @Operation(
        summary = "Получить информацию о программе",
        description = "Возвращает название, описание и длительность программы"
    )
    public ResponseEntity<TrainingProgram> getProgramById(@PathVariable UUID programId) {
        return programRepository.findById(programId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{programId}/week/{weekNumber}")
    @Operation(
        summary = "Получить программу на конкретную неделю",
        description = "Возвращает рассчитанные веса для каждого подхода на основе текущего 1ПМ или указанного веса"
    )
    public ResponseEntity<List<ProgramWeekResponse>> getProgramWeek(
            @Parameter(description = "ID программы")
            @PathVariable UUID programId,
            @Parameter(description = "Номер недели")
            @PathVariable Integer weekNumber,
            @Parameter(description = "ID упражнения (опционально)")
            @RequestParam(required = false) UUID exerciseId,
            @Parameter(description = "Пользовательский 1ПМ для расчета (опционально)")
            @RequestParam(required = false) BigDecimal customOneRm,
            @Parameter(description = "1ПМ в жиме лежа (опционально)")
            @RequestParam(required = false) BigDecimal bench1Rm,
            @Parameter(description = "1ПМ в приседаниях (опционально)")
            @RequestParam(required = false) BigDecimal squat1Rm,
            @Parameter(description = "1ПМ в становой тяге (опционально)")
            @RequestParam(required = false) BigDecimal deadlift1Rm) {

        return ResponseEntity.ok(programService.getProgramWeek(programId, weekNumber, exerciseId, customOneRm, bench1Rm, squat1Rm, deadlift1Rm));
    }

    @GetMapping("/{programId}/full")
    @Operation(
        summary = "Получить полную программу со всеми неделями",
        description = "Возвращает все недели и дни с рассчитанными весами"
    )
    public ResponseEntity<List<ProgramWeekResponse>> getFullProgram(
            @Parameter(description = "ID программы")
            @PathVariable UUID programId,
            @Parameter(description = "ID упражнения (опционально)")
            @RequestParam(required = false) UUID exerciseId,
            @Parameter(description = "Пользовательский 1ПМ для расчета (опционально)")
            @RequestParam(required = false) BigDecimal customOneRm,
            @Parameter(description = "1ПМ в жиме лежа (опционально)")
            @RequestParam(required = false) BigDecimal bench1Rm,
            @Parameter(description = "1ПМ в приседаниях (опционально)")
            @RequestParam(required = false) BigDecimal squat1Rm,
            @Parameter(description = "1ПМ в становой тяге (опционально)")
            @RequestParam(required = false) BigDecimal deadlift1Rm) {

        return ResponseEntity.ok(programService.getFullProgram(programId, exerciseId, customOneRm, bench1Rm, squat1Rm, deadlift1Rm));
    }
}