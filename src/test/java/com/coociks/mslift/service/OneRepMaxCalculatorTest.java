package com.coociks.mslift.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Тесты калькулятора одноповторного максимума (1ПМ)")
class OneRepMaxCalculatorTest {

    private OneRepMaxCalculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new OneRepMaxCalculator();
    }

    @Test
    @DisplayName("Эпли: 1 повторение возвращает исходный рабочий вес")
    void calculateEpley_singleRep_returnsExactWeight() {
        BigDecimal weight = BigDecimal.valueOf(100.0);
        BigDecimal result = calculator.calculateEpley(weight, 1);
        assertEquals(weight, result);
    }

    @ParameterizedTest(name = "Эпли: вес {0} кг на {1} повт. -> 1ПМ = {2} кг")
    @CsvSource({
            "100.0, 5, 116.7",
            "140.0, 3, 154.0",
            "80.0, 10, 106.7",
            "200.0, 1, 200.0"
    })
    @DisplayName("Эпли: проверка расчёта 1ПМ по формуле Epley")
    void calculateEpley_multipleReps(double weight, int reps, double expected) {
        BigDecimal result = calculator.calculateEpley(BigDecimal.valueOf(weight), reps);
        assertEquals(BigDecimal.valueOf(expected), result);
    }

    @Test
    @DisplayName("Бжицки: 1 повторение возвращает исходный вес")
    void calculateBrzycki_singleRep_returnsExactWeight() {
        BigDecimal weight = BigDecimal.valueOf(120.0);
        BigDecimal result = calculator.calculateBrzycki(weight, 1);
        assertEquals(weight, result);
    }

    @ParameterizedTest(name = "Бжицки: вес {0} кг на {1} повт. -> 1ПМ = {2} кг")
    @CsvSource({
            "100.0, 5, 112.5",
            "150.0, 3, 158.8",
            "70.0, 8, 86.9"
    })
    @DisplayName("Бжицки: проверка расчёта 1ПМ по формуле Brzycki")
    void calculateBrzycki_multipleReps(double weight, int reps, double expected) {
        BigDecimal result = calculator.calculateBrzycki(BigDecimal.valueOf(weight), reps);
        assertEquals(BigDecimal.valueOf(expected), result);
    }

    @Test
    @DisplayName("Бжицки: свыше 36 повторений выбрасывает исключение")
    void calculateBrzycki_over36Reps_throwsIllegalArgumentException() {
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> calculator.calculateBrzycki(BigDecimal.valueOf(100.0), 37)
        );
        assertTrue(ex.getMessage().contains("Формула Бржицки не применима"));
    }

    @ParameterizedTest(name = "1ПМ {0} кг при {1}% -> {2} кг")
    @CsvSource({
            "100.0, 80, 80.0",
            "150.0, 75, 112.5",
            "200.0, 50, 100.0",
            "140.0, 92, 128.8"
    })
    @DisplayName("Процент от 1ПМ: корректный расчет рабочего веса")
    void calculatePercentage(double oneRm, int percentage, double expected) {
        BigDecimal result = calculator.calculatePercentage(BigDecimal.valueOf(oneRm), percentage);
        assertEquals(BigDecimal.valueOf(expected), result);
    }
}
