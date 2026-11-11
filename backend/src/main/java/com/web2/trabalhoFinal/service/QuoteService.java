package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.*;
import com.web2.trabalhoFinal.entities.*;
import com.web2.trabalhoFinal.entities.enums.HistoryActions;
import com.web2.trabalhoFinal.entities.enums.RequestStatus;
import com.web2.trabalhoFinal.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Instant;

@Service
public class QuoteService {

    private final QuoteRepository quoteRepository;
    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final RequestHistoryRepository requestHistoryRepository;

    public QuoteService(
            QuoteRepository quoteRepository,
            MaintenanceRequestRepository maintenanceRequestRepository,
            EmployeeRepository employeeRepository,
            RequestHistoryRepository requestHistoryRepository
    ) {
        this.quoteRepository = quoteRepository;
        this.maintenanceRequestRepository = maintenanceRequestRepository;
        this.employeeRepository = employeeRepository;
        this.requestHistoryRepository = requestHistoryRepository;
    }

    // CRIA ORÇAMENTO
    @Transactional
    public ApiResponse<QuoteDTO> create(
            Long requestId,
            Long employeeId,
            CreateQuoteDTO dto
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

        if (request.getRequestStatus() != RequestStatus.OPEN) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Só é possível orçar uma solicitação aberta."
            );
        }

        if (request.getQuote() != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A solicitação já possui orçamento."
            );
        }

        if (dto == null
                || dto.price() == null
                || dto.price().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Informe um valor maior que zero."
            );
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Funcionário não encontrado."
                ));

        Instant date = Instant.now();

        Quote quote = new Quote();
        quote.setPrice(dto.price());
        quote.setQuoteDateTime(date);
        quote.setEmployee(employee);

        Quote saved = quoteRepository.save(quote);

        request.setQuote(saved);
        request.setRequestStatus(RequestStatus.QUOTED);
        maintenanceRequestRepository.save(request);

        saveHistory(
                request,
                HistoryActions.QUOTE_CREATED,
                RequestStatus.OPEN,
                RequestStatus.QUOTED,
                employee,
                date,
                null
        );

        QuoteDTO response = new QuoteDTO(
                saved.getPrice(),
                saved.getQuoteDateTime(),
                employee.getName()
        );

        return new ApiResponse<>(
                response,
                "Orçamento registrado com sucesso.",
                true
        );
    }

    // CONSULTA ORÇAMENTO COMO CLIENTE
    @Transactional(readOnly = true)
    public QuoteDTO findByRequestId(Long requestId, Long clientId) {
        MaintenanceRequest request = findClientRequest(requestId, clientId);
        Quote quote = request.getQuote();

        String employeeName = null;

        if (quote.getEmployee() != null) {
            employeeName = quote.getEmployee().getName();
        }

        return new QuoteDTO(
                quote.getPrice(),
                quote.getQuoteDateTime(),
                employeeName
        );
    }

    //APROVAR ORÇAMENTO
    @Transactional
    public ApiResponse<Void> approve(Long requestId, Long clientId) {
        MaintenanceRequest request = findClientRequest(requestId, clientId);

        if (request.getRequestStatus() != RequestStatus.QUOTED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Só é possível aprovar uma solicitação orçada."
            );
        }

        request.setRequestStatus(RequestStatus.APPROVED);
        maintenanceRequestRepository.save(request);

        saveHistory(
                request,
                HistoryActions.QUOTE_APPROVED,
                RequestStatus.QUOTED,
                RequestStatus.APPROVED,
                request.getClient(),
                Instant.now(),
                null
        );

        return new ApiResponse<>(
                "Serviço aprovado no valor de R$ "
                        + request.getQuote().getPrice().toPlainString(),
                true
        );
    }

    //REJEITAR ORÇAMENTO
    @Transactional
    public ApiResponse<Void> reject(
            Long requestId,
            Long clientId,
            RejectQuoteDTO dto
    ) {
        MaintenanceRequest request = findClientRequest(requestId, clientId);

        if (request.getRequestStatus() != RequestStatus.QUOTED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Só é possível rejeitar uma solicitação orçada."
            );
        }

        if (dto == null || dto.reason() == null || dto.reason().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Informe o motivo da rejeição."
            );
        }

        request.setRequestStatus(RequestStatus.REJECTED);
        maintenanceRequestRepository.save(request);

        saveHistory(
                request,
                HistoryActions.QUOTE_REJECTED,
                RequestStatus.QUOTED,
                RequestStatus.REJECTED,
                request.getClient(),
                Instant.now(),
                dto.reason().trim()
        );

        return new ApiResponse<>(
                "Serviço rejeitado.",
                true
        );
    }

    // BUSCA A SOLICITAÇÃO E CONFERE CLIENTE
    private MaintenanceRequest findClientRequest(
            Long requestId,
            Long clientId
    ) {
        if (clientId == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Entre como cliente."
            );
        }

        MaintenanceRequest request = maintenanceRequestRepository
                .findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Solicitação não encontrada."
                ));

        if (request.getClient().getId() != clientId) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Solicitação não encontrada."
            );
        }

        if (request.getQuote() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A solicitação ainda não possui orçamento."
            );
        }

        return request;
    }

    //REGISTRA A AÇÃO NO HISTÓRICO
    private void saveHistory(
            MaintenanceRequest request,
            HistoryActions action,
            RequestStatus previousStatus,
            RequestStatus newStatus,
            Person person,
            Instant date,
            String rejectionReason
    ) {
        RequestHistory history = new RequestHistory();
        history.setMaintenanceRequest(request);
        history.setActions(action);
        history.setPreviousStatus(previousStatus);
        history.setNewStatus(newStatus);
        history.setPerformedBy(person);
        history.setChangeDateTime(date);
        history.setRejectionReason(rejectionReason);

        requestHistoryRepository.save(history);
    }
}