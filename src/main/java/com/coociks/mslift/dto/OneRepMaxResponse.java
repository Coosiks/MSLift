package com.coociks.mslift.dto;

import java.math.BigDecimal;

public record OneRepMaxResponse(
    BigDecimal oneRepMax,
    String formulaUsed,
    BigDecimal weight,
    int reps
) {}