package com.web2.trabalhoFinal.repository.projection;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface DailyRevenueProjection {
    LocalDate getReportDate();
    BigDecimal getTotalAmount();
}
