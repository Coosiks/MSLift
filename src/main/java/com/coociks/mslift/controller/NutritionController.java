package com.coociks.mslift.controller;

import com.coociks.mslift.dto.DailyNutritionResponse;
import com.coociks.mslift.dto.NutritionEntryRequest;
import com.coociks.mslift.entity.FoodProduct;
import com.coociks.mslift.repository.FoodProductRepository;
import com.coociks.mslift.service.NutritionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/nutrition")
@RequiredArgsConstructor
@Tag(name = "Nutrition Tracker", description = "Дневник питания и калькулятор КБЖУ")
public class NutritionController {

    private final NutritionService nutritionService;
    private final FoodProductRepository foodProductRepository;

    @GetMapping("/products")
    @Operation(
        summary = "Получить список продуктов",
        description = "Возвращает справочник продуктов с КБЖУ на 100г"
    )
    public ResponseEntity<List<FoodProduct>> getAllProducts() {
        return ResponseEntity.ok(foodProductRepository.findAll());
    }

    @PostMapping("/entries")
    @Operation(
        summary = "Добавить запись в дневник питания",
        description = "Записывает приём пищи и автоматически рассчитывает КБЖУ"
    )
    public ResponseEntity<DailyNutritionResponse.NutritionEntryDto> addEntry(
            @Parameter(description = "Данные записи: продукт, граммовка, дата")
            @RequestBody NutritionEntryRequest request) {
        return ResponseEntity.ok(nutritionService.addEntry(request));
    }

    @GetMapping("/daily")
    @Operation(
        summary = "Получить сводку за день",
        description = "Возвращает все записи за день и суммарные КБЖУ"
    )
    public ResponseEntity<DailyNutritionResponse> getDailySummary(
            @Parameter(description = "Дата (если не указана — сегодня)")
            @RequestParam(required = false) LocalDate date) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        return ResponseEntity.ok(nutritionService.getDailySummary(targetDate));
    }

    @DeleteMapping("/entries/{id}")
    @Operation(summary = "Удалить запись из дневника питания")
    public ResponseEntity<Void> deleteEntry(@PathVariable UUID id) {
        nutritionService.deleteEntry(id);
        return ResponseEntity.noContent().build();
    }
}