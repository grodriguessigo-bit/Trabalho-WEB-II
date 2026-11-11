package com.web2.trabalhoFinal.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record QuoteDTO(
        BigDecimal price,
        Instant quoteDateTime,
        String employeeName
) {}