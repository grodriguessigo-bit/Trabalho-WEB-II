package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.ClientRequestDetailsDTO;
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
@CrossOrigin(origins = "http://localhost:4200", allowCredentials="true")
public class MaintenanceRequestController {

    private final MaintenanceRequestService maintenanceRequestService;

    public MaintenanceRequestController(MaintenanceRequestService maintenanceRequestService) {
        this.maintenanceRequestService = maintenanceRequestService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClientRequestSummaryDTO>>> findAllClient(
            @SessionAttribute(name = "clientId", required = false) Long clientId
    ){
        List<ClientRequestSummaryDTO> requests = maintenanceRequestService.findAllRequestByClient(clientId);

        return ResponseEntity.ok().body(new ApiResponse<>(requests, "Solicitações consultadas com sucesso.", true));
    }

    //mostrar detalhes para cliente
    @GetMapping("/{requestId}")
    public ResponseEntity<ApiResponse<ClientRequestDetailsDTO>> findById(
            @PathVariable("requestId") Long requestId,
            @SessionAttribute(name = "clientId", required = false) Long clientId
            ){

        ClientRequestDetailsDTO request =  maintenanceRequestService.findById(requestId, clientId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        request,
                        "Solicitação consultada com sucesso.",
                        true
                )
        );
    }

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
