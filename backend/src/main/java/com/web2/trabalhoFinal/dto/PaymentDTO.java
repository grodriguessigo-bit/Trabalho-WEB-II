package com.web2.trabalhoFinal.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record PaymentDTO(
        BigDecimal amount,
        Instant paymentDateTime
) {}