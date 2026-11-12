package com.web2.trabalhoFinal.dto;

import java.math.BigDecimal;

public record CategoryRevenueItemDTO(
        Long categoryId,
        String categoryName,
        Long requestsCount,
        BigDecimal amount
) {}
