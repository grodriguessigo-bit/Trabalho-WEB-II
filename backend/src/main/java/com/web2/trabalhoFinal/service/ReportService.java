package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.*;
import com.web2.trabalhoFinal.repository.PaymentRepository;
import com.web2.trabalhoFinal.repository.projection.CategoryRevenueProjection;
import com.web2.trabalhoFinal.repository.projection.DailyRevenueProjection;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;

@Service
public class ReportService {

    private static final ZoneId ZONE_SAO_PAULO = ZoneId.of("America/Sao_Paulo");

    private final PaymentRepository paymentRepository;

    public ReportService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Transactional(readOnly = true)
    public ApiResponse<DailyRevenueReportDTO> getDailyRevenue(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A data inicial não pode ser maior que a data final."
            );
        }

        Instant startInstant = null;
        if (startDate != null) {
            startInstant = startDate.atStartOfDay(ZONE_SAO_PAULO).toInstant();
        }

        Instant endInstant = null;
        if (endDate != null) {
            endInstant = endDate.atTime(LocalTime.MAX).atZone(ZONE_SAO_PAULO).toInstant();
        }

        List<DailyRevenueProjection> projections = paymentRepository.findDailyRevenue(startInstant, endInstant);

        List<DailyRevenueItemDTO> items = projections.stream()
                .map(p -> new DailyRevenueItemDTO(p.getReportDate(), p.getTotalAmount()))
                .toList();

        BigDecimal total = items.stream()
                .map(DailyRevenueItemDTO::amount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new ApiResponse<>(
                new DailyRevenueReportDTO(items, total),
                "Relatório de receitas por dia gerado com sucesso.",
                true
        );
    }

    @Transactional(readOnly = true)
    public ApiResponse<CategoryRevenueReportDTO> getRevenueByCategory() {
        List<CategoryRevenueProjection> projections = paymentRepository.findRevenueByCategory();

        List<CategoryRevenueItemDTO> items = projections.stream()
                .map(p -> new CategoryRevenueItemDTO(
                        p.getCategoryId(),
                        p.getCategoryName(),
                        p.getPaidRequestsCount(),
                        p.getTotalAmount()
                ))
                .toList();

        BigDecimal total = items.stream()
                .map(CategoryRevenueItemDTO::amount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new ApiResponse<>(
                new CategoryRevenueReportDTO(items, total),
                "Relatório de receitas por categoria gerado com sucesso.",
                true
        );
    }
}
