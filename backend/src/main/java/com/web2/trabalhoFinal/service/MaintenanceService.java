package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.PerformMaintenanceDTO;
import com.web2.trabalhoFinal.entities.*;
import com.web2.trabalhoFinal.entities.enums.HistoryActions;
import com.web2.trabalhoFinal.entities.enums.RequestStatus;
import com.web2.trabalhoFinal.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;

@Service
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final RequestHistoryRepository requestHistoryRepository;
    private final MaintenanceRequestService maintenanceRequestService;

    public MaintenanceService(
            MaintenanceRepository maintenanceRepository,
            MaintenanceRequestRepository maintenanceRequestRepository,
            EmployeeRepository employeeRepository,
            RequestHistoryRepository requestHistoryRepository,
            MaintenanceRequestService maintenanceRequestService
    ) {
        this.maintenanceRepository = maintenanceRepository;
        this.maintenanceRequestRepository = maintenanceRequestRepository;
        this.employeeRepository = employeeRepository;
        this.requestHistoryRepository = requestHistoryRepository;
        this.maintenanceRequestService = maintenanceRequestService;
    }

    @Transactional
    public ApiResponse<Void> perform(
            Long requestId,
            Long employeeId,
            PerformMaintenanceDTO dto
    ) {
        if (employeeId == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Entre como funcionário."
            );
        }

        MaintenanceRequest request = maintenanceRequestRepository
                .findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Solicitação não encontrada."
                ));

        if (!maintenanceRequestService.canEmployeeSee(request, employeeId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Solicitação não encontrada."
            );
        }

        RequestStatus previousStatus = request.getRequestStatus();

        if (previousStatus != RequestStatus.APPROVED
                && previousStatus != RequestStatus.REDIRECTED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A solicitação precisa estar aprovada ou redirecionada."
            );
        }

        if (dto == null
                || dto.maintenanceDescription() == null
                || dto.maintenanceDescription().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Informe a descrição da manutenção."
            );
        }

        if (dto.clientInstructions() == null
                || dto.clientInstructions().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Informe as orientações para o cliente."
            );
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Funcionário não encontrado."
                ));

        Instant date = Instant.now();

        Maintenance maintenance = new Maintenance();
        maintenance.setMaintenanceDescription(
                dto.maintenanceDescription().trim()
        );
        maintenance.setClienteInstructions(
                dto.clientInstructions().trim()
        );
        maintenance.setMaintenanceDateTime(date);
        maintenance.setEmployee(employee);

        Maintenance saved = maintenanceRepository.save(maintenance);

        request.setMaintenance(saved);
        request.setRequestStatus(RequestStatus.FIXED);
        maintenanceRequestRepository.save(request);

        RequestHistory history = new RequestHistory();
        history.setMaintenanceRequest(request);
        history.setActions(HistoryActions.MAINTENANCE_COMPLETED);
        history.setPreviousStatus(previousStatus);
        history.setNewStatus(RequestStatus.FIXED);
        history.setChangeDateTime(date);
        history.setPerformedBy(employee);

        requestHistoryRepository.save(history);

        return new ApiResponse<>(
                "Manutenção registrada com sucesso.",
                true
        );
    }
}