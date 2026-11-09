package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.entities.Maintenance;
import com.web2.trabalhoFinal.service.MaintenanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/maintenances")
@CrossOrigin(origins = "http://localhost:4200")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Maintenance>> salvar(@RequestBody Maintenance maintenance) {
        ApiResponse<Maintenance> resposta = maintenanceService.salvar(maintenance);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }
}
