package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.CreateMaintenanceRequest;
import com.web2.trabalhoFinal.dto.ClientRequestSummaryDTO;
import com.web2.trabalhoFinal.entities.MaintenanceRequest;
import com.web2.trabalhoFinal.service.MaintenanceRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/maintenance-requests")
@CrossOrigin(origins = "http://localhost:4200")
public class MaintenanceRequestController {

    private final MaintenanceRequestService maintenanceRequestService;

    public MaintenanceRequestController(MaintenanceRequestService maintenanceRequestService) {
        this.maintenanceRequestService = maintenanceRequestService;
    }
//
//    @GetMapping
//    public ResponseEntity<List<ClientRequestSummaryDTO>> findAllClient(){
//
//        maintenanceRequestService.
//
//
//    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClientRequestSummaryDTO>> insert(
            @RequestBody CreateMaintenanceRequest maintenanceRequestDTO,
            @SessionAttribute(name = "clientId", required = false) Long clientId
    ) {

        if(clientId == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>("Entre como um cliente para abrir uma solicitação.", false));
        }

        ApiResponse<MaintenanceRequest> result = maintenanceRequestService.save(maintenanceRequestDTO, clientId);
        MaintenanceRequest createdRequest = result.getData();

        ClientRequestSummaryDTO response = new ClientRequestSummaryDTO(
            createdRequest.getId(),
            createdRequest.getRequestDateTime(),
            createdRequest.getEquipmentDescription(),
            createdRequest.getRequestStatus()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(response, result.getMessage(), true));
    }



}
