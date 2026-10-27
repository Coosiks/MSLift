package com.coociks.mslift.dto;

import java.math.BigDecimal;

public record OneRepMaxRequest(
    BigDecimal weight,
    int reps,
    String formula
) {}