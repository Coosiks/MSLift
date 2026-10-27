package com.coociks.mslift.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "nutrition_entry")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutritionEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_product_id")
    private FoodProduct foodProduct;

    @Column(name = "custom_food_name")
    private String customFoodName;

    @Column(name = "meal_type")
    private String mealType;

    @Column(name = "weight_grams")
    private Integer weightGrams;

    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "total_calories", nullable = false, precision = 8, scale = 2)
    private BigDecimal totalCalories;

    @Column(name = "total_protein", nullable = false, precision = 8, scale = 2)
    private BigDecimal totalProtein;

    @Column(name = "total_fat", nullable = false, precision = 8, scale = 2)
    private BigDecimal totalFat;

    @Column(name = "total_carbs", nullable = false, precision = 8, scale = 2)
    private BigDecimal totalCarbs;
}