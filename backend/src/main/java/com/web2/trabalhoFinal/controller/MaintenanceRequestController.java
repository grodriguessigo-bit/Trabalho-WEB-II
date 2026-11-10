package com.web2.trabalhoFinal;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.entities.MaintenanceRequest;
import com.web2.trabalhoFinal.service.MaintenanceRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/maintenance-requests")
@CrossOrigin(origins = "http://localhost:4200")
public class MaintenanceRequestController {

    private final MaintenanceRequestService maintenanceRequestService;

    public MaintenanceRequestController(MaintenanceRequestService maintenanceRequestService) {
        this.maintenanceRequestService = maintenanceRequestService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MaintenanceRequest>> salvar(@RequestBody MaintenanceRequest maintenanceRequest) {
        ApiResponse<MaintenanceRequest> resposta = maintenanceRequestService.salvar(maintenanceRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }
}
