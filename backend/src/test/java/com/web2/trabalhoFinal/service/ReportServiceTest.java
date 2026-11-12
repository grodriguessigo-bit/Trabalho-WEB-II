package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.CategoryRevenueReportDTO;
import com.web2.trabalhoFinal.dto.DailyRevenueReportDTO;
import com.web2.trabalhoFinal.repository.PaymentRepository;
import com.web2.trabalhoFinal.repository.projection.CategoryRevenueProjection;
import com.web2.trabalhoFinal.repository.projection.DailyRevenueProjection;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    private ReportService reportService;

    @BeforeEach
    void setUp() {
        reportService = new ReportService(paymentRepository);
    }

    @Test
    @DisplayName("Deve lançar ResponseStatusException quando startDate for posterior a endDate")
    void shouldThrowWhenStartDateAfterEndDate() {
        LocalDate start = LocalDate.of(2026, 11, 10);
        LocalDate end = LocalDate.of(2026, 11, 5);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                reportService.getDailyRevenue(start, end)
        );

        assertTrue(ex.getMessage().contains("A data inicial não pode ser maior que a data final."));
    }

    @Test
    @DisplayName("Deve calcular receitas por dia e totalizar corretamente")
    void shouldCalculateDailyRevenueAndTotal() {
        LocalDate d1 = LocalDate.of(2026, 11, 1);
        LocalDate d2 = LocalDate.of(2026, 11, 2);

        DailyRevenueProjection p1 = mock(DailyRevenueProjection.class);
        when(p1.getReportDate()).thenReturn(d1);
        when(p1.getTotalAmount()).thenReturn(new BigDecimal("150.50"));

        DailyRevenueProjection p2 = mock(DailyRevenueProjection.class);
        when(p2.getReportDate()).thenReturn(d2);
        when(p2.getTotalAmount()).thenReturn(new BigDecimal("249.50"));

        when(paymentRepository.findDailyRevenue(any(), any())).thenReturn(List.of(p1, p2));

        ApiResponse<DailyRevenueReportDTO> response = reportService.getDailyRevenue(d1, d2);

        assertTrue(response.isSuccess());
        assertNotNull(response.getData());
        assertEquals(2, response.getData().items().size());
        assertEquals(new BigDecimal("400.00"), response.getData().total());
    }

    @Test
    @DisplayName("Deve calcular receitas por categoria incluindo zeradas e totalizar")
    void shouldCalculateCategoryRevenueAndTotal() {
        CategoryRevenueProjection c1 = mock(CategoryRevenueProjection.class);
        when(c1.getCategoryId()).thenReturn(1L);
        when(c1.getCategoryName()).thenReturn("Notebook");
        when(c1.getPaidRequestsCount()).thenReturn(3L);
        when(c1.getTotalAmount()).thenReturn(new BigDecimal("500.00"));

        CategoryRevenueProjection c2 = mock(CategoryRevenueProjection.class);
        when(c2.getCategoryId()).thenReturn(2L);
        when(c2.getCategoryName()).thenReturn("Desktop");
        when(c2.getPaidRequestsCount()).thenReturn(0L);
        when(c2.getTotalAmount()).thenReturn(BigDecimal.ZERO);

        when(paymentRepository.findRevenueByCategory()).thenReturn(List.of(c1, c2));

        ApiResponse<CategoryRevenueReportDTO> response = reportService.getRevenueByCategory();

        assertTrue(response.isSuccess());
        assertNotNull(response.getData());
        assertEquals(2, response.getData().items().size());
        assertEquals(new BigDecimal("500.00"), response.getData().total());
        assertEquals(0L, response.getData().items().get(1).requestsCount());
        assertEquals(BigDecimal.ZERO, response.getData().items().get(1).amount());
    }
}
