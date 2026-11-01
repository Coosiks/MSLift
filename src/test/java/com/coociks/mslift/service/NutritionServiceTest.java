package com.coociks.mslift.service;

import com.coociks.mslift.dto.DailyNutritionResponse;
import com.coociks.mslift.dto.NutritionEntryRequest;
import com.coociks.mslift.entity.FoodProduct;
import com.coociks.mslift.entity.NutritionEntry;
import com.coociks.mslift.repository.FoodProductRepository;
import com.coociks.mslift.repository.NutritionEntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Тесты бизнес-логики питания в NutritionService")
class NutritionServiceTest {

    @Mock
    private NutritionEntryRepository nutritionEntryRepository;

    @Mock
    private FoodProductRepository foodProductRepository;

    private NutritionService nutritionService;

    @BeforeEach
    void setUp() {
        nutritionService = new NutritionService(nutritionEntryRepository, foodProductRepository);
    }

    @Test
    @DisplayName("Авторасчет калорий по формуле 4*P + 9*F + 4*C при отсутствии указанных калорий")
    void addEntry_calculatesCaloriesFromMacros_whenCaloriesNull() {
        // Record fields: foodProductId, foodName, weightGrams, calories, protein, fat, carbs, mealType, entryDate
        NutritionEntryRequest request = new NutritionEntryRequest(
                null,
                "Творог с ягодами",
                200,
                null,                     // calories == null
                BigDecimal.valueOf(18.0), // 18 * 4 = 72
                BigDecimal.valueOf(5.0),  // 5 * 9 = 45
                BigDecimal.valueOf(10.0), // 10 * 4 = 40 => Total 157.0
                "Завтрак",
                LocalDate.of(2026, 11, 1)
        );

        when(nutritionEntryRepository.save(any(NutritionEntry.class)))
                .thenAnswer(invocation -> {
                    NutritionEntry entry = invocation.getArgument(0);
                    entry.setId(UUID.randomUUID());
                    return entry;
                });

        DailyNutritionResponse.NutritionEntryDto result = nutritionService.addEntry(request);

        ArgumentCaptor<NutritionEntry> captor = ArgumentCaptor.forClass(NutritionEntry.class);
        verify(nutritionEntryRepository).save(captor.capture());

        NutritionEntry savedEntry = captor.getValue();
        assertEquals(BigDecimal.valueOf(157.0), savedEntry.getTotalCalories());
        assertEquals("Творог с ягодами", result.productName());
    }

    @Test
    @DisplayName("Расчет КБЖУ порции на основе граммовки продукта из базы")
    void addEntry_calculatesFromFoodProduct() {
        UUID productId = UUID.randomUUID();
        FoodProduct product = FoodProduct.builder()
                .id(productId)
                .name("Куриная грудка")
                .caloriesPer100g(BigDecimal.valueOf(113.0))
                .proteinPer100g(BigDecimal.valueOf(23.6))
                .fatPer100g(BigDecimal.valueOf(1.9))
                .carbsPer100g(BigDecimal.valueOf(0.4))
                .build();

        when(foodProductRepository.findById(productId)).thenReturn(Optional.of(product));
        when(nutritionEntryRepository.save(any(NutritionEntry.class)))
                .thenAnswer(invocation -> {
                    NutritionEntry entry = invocation.getArgument(0);
                    entry.setId(UUID.randomUUID());
                    return entry;
                });

        // 200г куриной грудки: calories, protein, fat, carbs are null
        NutritionEntryRequest request = new NutritionEntryRequest(
                productId,
                null,
                200,
                null,
                null,
                null,
                null,
                "Обед",
                LocalDate.of(2026, 11, 1)
        );

        nutritionService.addEntry(request);

        ArgumentCaptor<NutritionEntry> captor = ArgumentCaptor.forClass(NutritionEntry.class);
        verify(nutritionEntryRepository).save(captor.capture());

        NutritionEntry saved = captor.getValue();
        // 113 * 2 = 226.0 ккал, 23.6 * 2 = 47.2 г белка
        assertEquals(BigDecimal.valueOf(226.0), saved.getTotalCalories());
        assertEquals(BigDecimal.valueOf(47.2), saved.getTotalProtein());
        assertEquals(BigDecimal.valueOf(3.8), saved.getTotalFat());
        assertEquals(BigDecimal.valueOf(0.8), saved.getTotalCarbs());
    }

    @Test
    @DisplayName("Суммирование КБЖУ за день")
    void getDailySummary_aggregatesTotals() {
        LocalDate date = LocalDate.of(2026, 11, 1);

        NutritionEntry e1 = NutritionEntry.builder()
                .id(UUID.randomUUID())
                .customFoodName("Овсянка")
                .totalCalories(BigDecimal.valueOf(350.0))
                .totalProtein(BigDecimal.valueOf(12.0))
                .totalFat(BigDecimal.valueOf(6.0))
                .totalCarbs(BigDecimal.valueOf(62.0))
                .mealType("Завтрак")
                .build();

        NutritionEntry e2 = NutritionEntry.builder()
                .id(UUID.randomUUID())
                .customFoodName("Куриное филе с рисом")
                .totalCalories(BigDecimal.valueOf(450.0))
                .totalProtein(BigDecimal.valueOf(40.0))
                .totalFat(BigDecimal.valueOf(8.0))
                .totalCarbs(BigDecimal.valueOf(50.0))
                .mealType("Обед")
                .build();

        when(nutritionEntryRepository.findByEntryDate(date)).thenReturn(List.of(e1, e2));

        DailyNutritionResponse summary = nutritionService.getDailySummary(date);

        assertEquals(2, summary.entries().size());
        assertEquals(BigDecimal.valueOf(800.0), summary.totalCalories());
        assertEquals(BigDecimal.valueOf(52.0), summary.totalProtein());
        assertEquals(BigDecimal.valueOf(14.0), summary.totalFat());
        assertEquals(BigDecimal.valueOf(112.0), summary.totalCarbs());
    }
}
