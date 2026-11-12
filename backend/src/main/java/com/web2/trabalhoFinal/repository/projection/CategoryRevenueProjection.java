package com.web2.trabalhoFinal.repository.projection;

import java.math.BigDecimal;

public interface CategoryRevenueProjection {
    Long getCategoryId();
    String getCategoryName();
    Long getPaidRequestsCount();
    BigDecimal getTotalAmount();
}
