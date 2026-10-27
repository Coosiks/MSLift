package com.coociks.mslift.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class OneRepMaxCalculator {

    
    public BigDecimal calculateEpley(BigDecimal weight, int reps) {
        if (reps == 1) return weight;
        BigDecimal multiplier = BigDecimal.ONE.add(BigDecimal.valueOf(reps).divide(BigDecimal.valueOf(30), 4, RoundingMode.HALF_UP));
        return weight.multiply(multiplier).setScale(1, RoundingMode.HALF_UP);
    }

    
    public BigDecimal calculateBrzycki(BigDecimal weight, int reps) {
        if (reps == 1) return weight;
        if (reps > 36) throw new IllegalArgumentException("Формула Бржицки не применима для более чем 36 повторений");
        
        BigDecimal multiplier = BigDecimal.valueOf(36).divide(BigDecimal.valueOf(37 - reps), 4, RoundingMode.HALF_UP);
        return weight.multiply(multiplier).setScale(1, RoundingMode.HALF_UP);
    }

    
    public BigDecimal calculatePercentage(BigDecimal oneRm, int percentage) {
        return oneRm.multiply(BigDecimal.valueOf(percentage))
                    .divide(BigDecimal.valueOf(100), 1, RoundingMode.HALF_UP);
    }
}