package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.RedirectMaintenanceDTO;
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
public class RedirectService {

    private final RedirectRepository redirectRepository;
    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final RequestHistoryRepository requestHistoryRepository;
    private final MaintenanceRequestService maintenanceRequestService;

    public RedirectService(
            RedirectRepository redirectRepository,
            MaintenanceRequestRepository maintenanceRequestRepository,
            EmployeeRepository employeeRepository,
            RequestHistoryRepository requestHistoryRepository,
            MaintenanceRequestService maintenanceRequestService
    ) {
        this.redirectRepository = redirectRepository;
        this.maintenanceRequestRepository = maintenanceRequestRepository;
        this.employeeRepository = employeeRepository;
        this.requestHistoryRepository = requestHistoryRepository;
        this.maintenanceRequestService = maintenanceRequestService;
    }

    @Transactional
    public ApiResponse<Void> redirect(
            Long requestId,
            Long employeeId,
            RedirectMaintenanceDTO destinationIdDTO
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

        if (destinationIdDTO == null
                || destinationIdDTO.destinationEmployeeId() == null
                || destinationIdDTO.destinationEmployeeId() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Selecione o funcionário de destino."
            );
        }

        if (employeeId.equals(destinationIdDTO.destinationEmployeeId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Você não pode redirecionar para si mesmo."
            );
        }

        Employee source = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Funcionário de origem não encontrado."
                ));

        Employee destination = employeeRepository
                .findById(destinationIdDTO.destinationEmployeeId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Funcionário de destino não encontrado."
                ));

        RequestHistory history = new RequestHistory();
        history.setMaintenanceRequest(request);
        history.setActions(HistoryActions.MAINTENANCE_REDIRECTED);
        history.setPreviousStatus(previousStatus);
        history.setNewStatus(RequestStatus.REDIRECTED);
        history.setChangeDateTime(Instant.now());
        history.setPerformedBy(source);

        RequestHistory savedHistory = requestHistoryRepository.save(history);

        Redirect redirect = new Redirect();
        redirect.setRequestHistory(savedHistory);
        redirect.setSourceEmployee(source);
        redirect.setDestinationEmployee(destination);

        Redirect savedRedirect = redirectRepository.save(redirect);
        savedHistory.setRedirect(savedRedirect);

        request.setRequestStatus(RequestStatus.REDIRECTED);
        maintenanceRequestRepository.save(request);

        return new ApiResponse<>(
                "Solicitação redirecionada com sucesso.",
                true
        );
    }
}