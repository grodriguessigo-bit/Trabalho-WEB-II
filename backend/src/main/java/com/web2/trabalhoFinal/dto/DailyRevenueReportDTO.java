package com.web2.trabalhoFinal.dto;

import java.math.BigDecimal;
import java.util.List;

public record DailyRevenueReportDTO(
        List<DailyRevenueItemDTO> items,
        BigDecimal total
) {}
