package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.*;
import com.web2.trabalhoFinal.entities.MaintenanceRequest;
import com.web2.trabalhoFinal.service.MaintenanceRequestService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/maintenance-requests")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials="true")
public class MaintenanceRequestController {

    private final MaintenanceRequestService maintenanceRequestService;

    public MaintenanceRequestController(MaintenanceRequestService maintenanceRequestService) {
        this.maintenanceRequestService = maintenanceRequestService;
    }


    //SOLICITACOES NA TELA INICIAL DE CLIENTES
    @GetMapping
    public ResponseEntity<ApiResponse<List<ClientRequestSummaryDTO>>> findAllClient(
            @SessionAttribute(name = "clientId", required = false) Long clientId
    ){
        List<ClientRequestSummaryDTO> requests = maintenanceRequestService.findAllRequestByClient(clientId);

        return ResponseEntity.ok().body(new ApiResponse<>(requests, "Solicitações consultadas com sucesso.", true));
    }


    //DETALHES DA SOLICITAÇÃO PARA O CLIENTE
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

    //VISUALIZAÇÃO DE SOLICITAÇÕES COM FILTROS NA TELA DO EMPLOYEE
    @GetMapping("/employee")
    public ResponseEntity<ApiResponse<List<EmployeeRequestSummaryDTO>>> findAllForEmployee(
            @SessionAttribute(name = "employeeId", required = false)
            Long employeeId,

            @RequestParam(name = "filter", defaultValue = "ABERTAS")
            String filter,

            @RequestParam(name = "startDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam(name = "endDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {
        List<EmployeeRequestSummaryDTO> requests =
                maintenanceRequestService.findAllForEmployee(
                        employeeId,
                        filter,
                        startDate,
                        endDate
                );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        requests,
                        "Solicitações consultadas com sucesso.",
                        true
                )
        );
    }

    //DETALHES DA SOLICITAÇÃO PARA O EMPLOYEE
    @GetMapping("/employee/{requestId}")
    public ResponseEntity<ApiResponse<EmployeeRequestDetailsDTO>> findByIdForEmployee(
            @PathVariable("requestId") Long requestId,
            @SessionAttribute(name = "employeeId", required = false) Long employeeId
    ) {
        EmployeeRequestDetailsDTO request =
                maintenanceRequestService.findByIdForEmployee(
                        requestId,
                        employeeId
                );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        request,
                        "Solicitação consultada com sucesso.",
                        true
                )
        );
    }


    //INSERT
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
