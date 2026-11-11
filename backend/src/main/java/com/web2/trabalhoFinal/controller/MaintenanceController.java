package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.PerformMaintenanceDTO;
import com.web2.trabalhoFinal.service.MaintenanceService;
import com.web2.trabalhoFinal.service.EmployeePermission;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/maintenances")
@CrossOrigin(
        origins = "http://localhost:4200",
        allowCredentials = "true"
)
public class MaintenanceController {

    private final MaintenanceService maintenanceService;
    private final EmployeePermission employeePermission;

    public MaintenanceController(MaintenanceService maintenanceService, EmployeePermission employeePermission) {
        this.maintenanceService = maintenanceService;
        this.employeePermission = employeePermission;
    }

    @PostMapping("/request/{requestId}")
    public ResponseEntity<ApiResponse<Void>> perform(
            @PathVariable("requestId") Long requestId,
            @SessionAttribute(name = "employeeId", required = false)
            Long employeeId,
            @RequestBody PerformMaintenanceDTO dto
    ) {
        employeePermission.verificar(employeeId);
        ApiResponse<Void> response = maintenanceService.perform(
                requestId,
                employeeId,
                dto
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}