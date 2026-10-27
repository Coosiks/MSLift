package com.coociks.mslift.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "food_product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "calories_per_100g", nullable = false, precision = 8, scale = 2)
    private BigDecimal caloriesPer100g;

    @Column(name = "protein_per_100g", nullable = false, precision = 8, scale = 2)
    private BigDecimal proteinPer100g;

    @Column(name = "fat_per_100g", nullable = false, precision = 8, scale = 2)
    private BigDecimal fatPer100g;

    @Column(name = "carbs_per_100g", nullable = false, precision = 8, scale = 2)
    private BigDecimal carbsPer100g;
}