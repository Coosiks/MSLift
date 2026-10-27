package com.coociks.mslift.controller;

import com.coociks.mslift.dto.OneRepMaxRequest;
import com.coociks.mslift.dto.OneRepMaxResponse;
import com.coociks.mslift.service.OneRepMaxCalculator;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/calculator")
@RequiredArgsConstructor
@Tag(name = "1RM Calculator", description = "Калькулятор одноповторного максимума (1ПМ)")
public class OneRepMaxController {

    private final OneRepMaxCalculator calculator;

    @PostMapping("/1rm")
    @Operation(
        summary = "Рассчитать 1ПМ",
        description = "Рассчитывает одноповторный максимум по формуле Эпли или Бржицки"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "1ПМ успешно рассчитан"),
        @ApiResponse(responseCode = "400", description = "Некорректные данные (вес или повторения)")
    })
    public ResponseEntity<OneRepMaxResponse> calculate1RM(
            @Parameter(description = "Данные для расчёта: вес, повторения, формула")
            @RequestBody OneRepMaxRequest request) {
        
        BigDecimal oneRm;
        String formulaName;

        if ("BRZYCKI".equalsIgnoreCase(request.formula())) {
            oneRm = calculator.calculateBrzycki(request.weight(), request.reps());
            formulaName = "Brzycki";
        } else {
            oneRm = calculator.calculateEpley(request.weight(), request.reps());
            formulaName = "Epley";
        }

        OneRepMaxResponse response = new OneRepMaxResponse(
                oneRm,
                formulaName,
                request.weight(),
                request.reps()
        );

        return ResponseEntity.ok(response);
    }
}