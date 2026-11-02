package com.coociks.mslift.controller;

import com.coociks.mslift.exception.GlobalExceptionHandler;
import com.coociks.mslift.service.OneRepMaxCalculator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OneRepMaxController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
@DisplayName("Тесты серверной валидации контроллера 1ПМ (Jakarta Validation)")
class OneRepMaxControllerValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OneRepMaxCalculator calculator;

    @Test
    @DisplayName("Валидация: отрицательный вес возвращает 400 Bad Request с описанием ошибки")
    void calculate1RM_negativeWeight_returns400() throws Exception {
        String invalidJson = """
            {
                "weight": -100.0,
                "reps": 5,
                "formula": "EPLEY"
            }
        """;

        mockMvc.perform(post("/api/calculator/1rm")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Ошибка валидации входных данных"))
                .andExpect(jsonPath("$.details.weight").exists());
    }

    @Test
    @DisplayName("Валидация: нулевые повторения возвращают 400 Bad Request")
    void calculate1RM_zeroReps_returns400() throws Exception {
        String invalidJson = """
            {
                "weight": 100.0,
                "reps": 0,
                "formula": "EPLEY"
            }
        """;

        mockMvc.perform(post("/api/calculator/1rm")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details.reps").exists());
    }

    @Test
    @DisplayName("Валидация: свыше 36 повторений возвращает 400 Bad Request")
    void calculate1RM_over36Reps_returns400() throws Exception {
        String invalidJson = """
            {
                "weight": 100.0,
                "reps": 40,
                "formula": "BRZYCKI"
            }
        """;

        mockMvc.perform(post("/api/calculator/1rm")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details.reps").exists());
    }
}
