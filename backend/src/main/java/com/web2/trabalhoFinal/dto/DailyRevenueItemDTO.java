package com.web2.trabalhoFinal.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DailyRevenueItemDTO(
        LocalDate date,
        BigDecimal amount
) {}
