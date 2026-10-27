package com.coociks.mslift.service;

import com.coociks.mslift.dto.DailyNutritionResponse;
import com.coociks.mslift.dto.NutritionEntryRequest;
import com.coociks.mslift.entity.FoodProduct;
import com.coociks.mslift.entity.NutritionEntry;
import com.coociks.mslift.repository.FoodProductRepository;
import com.coociks.mslift.repository.NutritionEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NutritionService {

    private final NutritionEntryRepository nutritionEntryRepository;
    private final FoodProductRepository foodProductRepository;

    @Transactional
    public DailyNutritionResponse.NutritionEntryDto addEntry(NutritionEntryRequest request) {
        FoodProduct product = null;
        if (request.foodProductId() != null) {
            product = foodProductRepository.findById(request.foodProductId()).orElse(null);
        }

        LocalDate date = request.entryDate() != null ? request.entryDate() : LocalDate.now();

        String name = request.foodName();
        if (name == null || name.isBlank()) {
            if (product != null) {
                name = product.getName();
            } else {
                name = "Приём пищи";
            }
        }

        BigDecimal calories = request.calories();
        BigDecimal protein = request.protein() != null ? request.protein() : BigDecimal.ZERO;
        BigDecimal fat = request.fat() != null ? request.fat() : BigDecimal.ZERO;
        BigDecimal carbs = request.carbs() != null ? request.carbs() : BigDecimal.ZERO;

        if (calories == null) {
            if (product != null && request.weightGrams() != null && request.weightGrams() > 0) {
                BigDecimal weightMultiplier = BigDecimal.valueOf(request.weightGrams()).divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
                calories = product.getCaloriesPer100g().multiply(weightMultiplier).setScale(1, RoundingMode.HALF_UP);
                protein = product.getProteinPer100g().multiply(weightMultiplier).setScale(1, RoundingMode.HALF_UP);
                fat = product.getFatPer100g().multiply(weightMultiplier).setScale(1, RoundingMode.HALF_UP);
                carbs = product.getCarbsPer100g().multiply(weightMultiplier).setScale(1, RoundingMode.HALF_UP);
            } else {
                // Auto calculate calories from macros: P*4 + F*9 + C*4
                calories = protein.multiply(BigDecimal.valueOf(4))
                        .add(fat.multiply(BigDecimal.valueOf(9)))
                        .add(carbs.multiply(BigDecimal.valueOf(4)))
                        .setScale(1, RoundingMode.HALF_UP);
            }
        }

        NutritionEntry entry = NutritionEntry.builder()
                .foodProduct(product)
                .customFoodName(name)
                .mealType(request.mealType() != null && !request.mealType().isBlank() ? request.mealType() : "Основной")
                .weightGrams(request.weightGrams())
                .entryDate(date)
                .totalCalories(calories)
                .totalProtein(protein)
                .totalFat(fat)
                .totalCarbs(carbs)
                .build();

        NutritionEntry saved = nutritionEntryRepository.save(entry);

        return new DailyNutritionResponse.NutritionEntryDto(
                saved.getId(),
                saved.getCustomFoodName(),
                saved.getWeightGrams(),
                saved.getTotalCalories(),
                saved.getTotalProtein(),
                saved.getTotalFat(),
                saved.getTotalCarbs(),
                saved.getMealType()
        );
    }

    @Transactional(readOnly = true)
    public DailyNutritionResponse getDailySummary(LocalDate date) {
        List<NutritionEntry> entries = nutritionEntryRepository.findByEntryDate(date);
        
        BigDecimal totalCal = BigDecimal.ZERO;
        BigDecimal totalProt = BigDecimal.ZERO;
        BigDecimal totalFat = BigDecimal.ZERO;
        BigDecimal totalCarb = BigDecimal.ZERO;

        List<DailyNutritionResponse.NutritionEntryDto> dtos = new ArrayList<>();

        for (NutritionEntry e : entries) {
            totalCal = totalCal.add(e.getTotalCalories() != null ? e.getTotalCalories() : BigDecimal.ZERO);
            totalProt = totalProt.add(e.getTotalProtein() != null ? e.getTotalProtein() : BigDecimal.ZERO);
            totalFat = totalFat.add(e.getTotalFat() != null ? e.getTotalFat() : BigDecimal.ZERO);
            totalCarb = totalCarb.add(e.getTotalCarbs() != null ? e.getTotalCarbs() : BigDecimal.ZERO);

            String displayName = e.getCustomFoodName();
            if ((displayName == null || displayName.isBlank()) && e.getFoodProduct() != null) {
                displayName = e.getFoodProduct().getName();
            }
            if (displayName == null || displayName.isBlank()) {
                displayName = "Блюдо";
            }

            dtos.add(new DailyNutritionResponse.NutritionEntryDto(
                    e.getId(),
                    displayName,
                    e.getWeightGrams(),
                    e.getTotalCalories(),
                    e.getTotalProtein(),
                    e.getTotalFat(),
                    e.getTotalCarbs(),
                    e.getMealType() != null ? e.getMealType() : "Основной"
            ));
        }

        return new DailyNutritionResponse(dtos, totalCal, totalProt, totalFat, totalCarb);
    }

    @Transactional
    public void deleteEntry(UUID id) {
        nutritionEntryRepository.deleteById(id);
    }
}