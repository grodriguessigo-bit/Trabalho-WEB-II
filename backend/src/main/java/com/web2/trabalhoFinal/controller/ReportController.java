package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.CategoryRevenueReportDTO;
import com.web2.trabalhoFinal.dto.DailyRevenueReportDTO;
import com.web2.trabalhoFinal.service.EmployeePermission;
import com.web2.trabalhoFinal.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ReportController {

    private final ReportService reportService;
    private final EmployeePermission employeePermission;

    public ReportController(ReportService reportService, EmployeePermission employeePermission) {
        this.reportService = reportService;
        this.employeePermission = employeePermission;
    }

    @GetMapping("/revenue-by-day")
    public ResponseEntity<ApiResponse<DailyRevenueReportDTO>> getDailyRevenue(
            @RequestParam(name = "startDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(name = "endDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @SessionAttribute(name = "employeeId", required = false) Long employeeId
    ) {
        employeePermission.verificar(employeeId);
        ApiResponse<DailyRevenueReportDTO> response = reportService.getDailyRevenue(startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/revenue-by-category")
    public ResponseEntity<ApiResponse<CategoryRevenueReportDTO>> getRevenueByCategory(
            @SessionAttribute(name = "employeeId", required = false) Long employeeId
    ) {
        employeePermission.verificar(employeeId);
        ApiResponse<CategoryRevenueReportDTO> response = reportService.getRevenueByCategory();
        return ResponseEntity.ok(response);
    }
}
