package com.coociks.mslift.repository;

import com.coociks.mslift.entity.FoodProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface FoodProductRepository extends JpaRepository<FoodProduct, UUID> {
}