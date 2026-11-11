package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.*;
import com.web2.trabalhoFinal.entities.*;
import com.web2.trabalhoFinal.entities.enums.HistoryActions;
import com.web2.trabalhoFinal.entities.enums.RequestStatus;
import com.web2.trabalhoFinal.exception.InvalidMaintenanceRequestException;
import com.web2.trabalhoFinal.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class MaintenanceRequestService {

    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final ClientRepository clientRepository;
    private final CategoryRepository categoryRepository;
    private final RequestHistoryRepository requestHistoryRepository;
    private final EmployeeRepository employeeRepository;

    public MaintenanceRequestService(MaintenanceRequestRepository maintenanceRequestRepository, ClientRepository clientRepository, CategoryRepository categoryRepository, RequestHistoryRepository requestHistoryRepository, EmployeeRepository employeeRepository) {
        this.maintenanceRequestRepository = maintenanceRequestRepository;
        this.clientRepository = clientRepository;
        this.categoryRepository = categoryRepository;
        this.requestHistoryRepository = requestHistoryRepository;
        this.employeeRepository = employeeRepository;
    }

    //INSERT DE SOLICITACAO
    @Transactional
    public ApiResponse<MaintenanceRequest> save(CreateMaintenanceRequest maintenanceRequestDto, Long clienteId) {

        if(maintenanceRequestDto == null){
            throw new InvalidMaintenanceRequestException("Informe dos dados da solicitação");
        }

        if(maintenanceRequestDto.equipmentDescription() == null || maintenanceRequestDto.equipmentDescription().isBlank()){
            throw new InvalidMaintenanceRequestException("Informe a descrição do equipamento.");
        }

        if(maintenanceRequestDto.defectDescription() == null || maintenanceRequestDto.defectDescription().isBlank()){
            throw new InvalidMaintenanceRequestException("Informe a descrição do defeito.");
        }

        if (maintenanceRequestDto.equipmentDescription().trim().length() > 30) {
            throw new InvalidMaintenanceRequestException(
                    "A descrição do equipamento deve ter até 30 caracteres."
            );
        }

        if(maintenanceRequestDto.categoryId() == null || maintenanceRequestDto.categoryId() <= 0){
            throw new InvalidMaintenanceRequestException("Selecione uma categoria válida.");
        }

        if (clienteId == null || clienteId <= 0) {
            throw new InvalidMaintenanceRequestException("O cliente não foi identificado.");
        }

        Client client = clientRepository.findById(clienteId).
                orElseThrow(() -> new InvalidMaintenanceRequestException("Cliente não encontrado."));

        Category category = categoryRepository.findById(maintenanceRequestDto.categoryId()).
                orElseThrow(() -> new InvalidMaintenanceRequestException("Categoria não encontrada."));

        if(!category.isActive()){
            throw new InvalidMaintenanceRequestException("A categoria está desativada.");
        }

        MaintenanceRequest maintenance = new MaintenanceRequest();

        maintenance.setEquipmentDescription(maintenanceRequestDto.equipmentDescription().trim());
        maintenance.setDefectDescription(maintenanceRequestDto.defectDescription().trim());
        maintenance.setClient(client);
        maintenance.setCategory(category);
        maintenance.setRequestDateTime(Instant.now());
        maintenance.setRequestStatus(RequestStatus.OPEN);

        MaintenanceRequest saveMaintenance = maintenanceRequestRepository.save(maintenance);

        RequestHistory history = new RequestHistory();
        history.setMaintenanceRequest(saveMaintenance);
        history.setActions(HistoryActions.REQUEST_CREATED);
        history.setPreviousStatus(null);
        history.setNewStatus(RequestStatus.OPEN);
        history.setChangeDateTime(maintenance.getRequestDateTime());
        history.setPerformedBy(client);

        requestHistoryRepository.save(history);

        return new ApiResponse<>(saveMaintenance, "Solicitação de manutenção salva com sucesso", true);
    }


    //SOLICITACOES NA TELA INICIAL DE CLIENTES
    public List<ClientRequestSummaryDTO> findAllRequestByClient(Long clientId){

        if (clientId == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Entre como cliente."
            );
        }

        List<MaintenanceRequest> requests = maintenanceRequestRepository.findByClient_idOrderByRequestDateTimeAsc(clientId);

        return requests.stream()
        .map(request -> new ClientRequestSummaryDTO(
                request.getId(),
                request.getRequestDateTime(),
                request.getEquipmentDescription(),
                request.getRequestStatus()
        )).toList();
    }



    //DETALHES DA SOLICITAÇÃO PARA O CLIENTE
    @Transactional(readOnly = true)
    public ClientRequestDetailsDTO findById (Long requestId, Long clientId){

        if (clientId == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Entre como cliente."
            );
        }

        MaintenanceRequest request =  maintenanceRequestRepository.findById(requestId).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Solicitação não encontrada"));

        if(request.getClient().getId() != clientId){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Solicitação não encontrada");
        }


        QuoteDTO quoteDTO = null;
        PaymentDTO paymentDTO = null;

        Quote quote = request.getQuote();

        if(quote != null){
            String employeeName = null;

            if(quote.getEmployee() != null){
                employeeName = quote.getEmployee().getName();
            }

            quoteDTO = new QuoteDTO(
                    quote.getPrice(),
                    quote.getQuoteDateTime(),
                    employeeName
            );

            if(quote.getPayment() != null){
                paymentDTO = new PaymentDTO(
                        quote.getPayment().getAmount(),
                        quote.getPayment().getPaymentDateTime()
                );
            }
        }

        MaintenanceDTO maintenanceDTO = null;
        Maintenance maintenance = request.getMaintenance();

        if(maintenance != null){

            String employeeName = null;

            if(maintenance.getEmployee() != null){
                employeeName = maintenance.getEmployee().getName();
            }

            maintenanceDTO = new MaintenanceDTO(
                    maintenance.getMaintenanceDescription(),
                    maintenance.getClienteInstructions(),
                    maintenance.getMaintenanceDateTime(),
                    employeeName
            );

        }

        List<ClientRequestHistoryDTO> historyDTO = new ArrayList<>();

        if(request.getRequestHistory() != null){

            for(RequestHistory requestHistory : request.getRequestHistory()){
                String employee = null;

                if(requestHistory.getPerformedBy() != null){
                    employee = requestHistory.getPerformedBy().getName();
                }

                historyDTO.add(new ClientRequestHistoryDTO(
                        requestHistory.getId(),
                        requestHistory.getActions(),
                        requestHistory.getPreviousStatus(),
                        requestHistory.getNewStatus(),
                        requestHistory.getChangeDateTime(),
                        employee,
                        requestHistory.getRejectionReason()
                ));
            }

            historyDTO.sort(Comparator.comparing(ClientRequestHistoryDTO::changeDateTime)
                    .thenComparing(ClientRequestHistoryDTO::requestHistoryId));

        }

        return new ClientRequestDetailsDTO(
                request.getId(),
                request.getEquipmentDescription(),
                request.getDefectDescription(),
                request.getRequestDateTime(),
                request.getRequestStatus(),
                request.getCategory().getName(),
                quoteDTO,
                maintenanceDTO,
                paymentDTO,
                historyDTO
        );
    }



    //VISUALIZAÇÃO DE SOLICITAÇÕES COM FILTROS NA TELA DO EMPLOYEE
    @Transactional(readOnly = true)
    public List<EmployeeRequestSummaryDTO> findAllForEmployee(
            Long employeeId,
            String filter,
            LocalDate startDate,
            LocalDate endDate
    ) {
        if (employeeId == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Entre como funcionário."
            );
        }

        if (filter == null) {
            filter = "ABERTAS";
        }

        if (!filter.equals("ABERTAS")
                && !filter.equals("TODAS")
                && !filter.equals("HOJE")
                && !filter.equals("PERIODO")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Filtro inválido."
            );
        }

        if (filter.equals("PERIODO")) {
            if (startDate == null || endDate == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Preencha a data inicial e a final."
                );
            }

            if (startDate.isAfter(endDate)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "A data inicial não pode ser maior que a final."
                );
            }
        }

        ZoneId zone = ZoneId.of("America/Sao_Paulo");
        LocalDate today = LocalDate.now(zone);

        List<MaintenanceRequest> requests =
                maintenanceRequestRepository.findAll();

        List<EmployeeRequestSummaryDTO> result = new ArrayList<>();

        for (MaintenanceRequest request : requests) {
            if (!canEmployeeSee(request, employeeId)) {
                continue;
            }

            if (filter.equals("ABERTAS")
                    && request.getRequestStatus() != RequestStatus.OPEN) {
                continue;
            }

            LocalDate requestDate = request.getRequestDateTime()
                    .atZone(zone)
                    .toLocalDate();

            if (filter.equals("HOJE") && !requestDate.equals(today)) {
                continue;
            }

            if (filter.equals("PERIODO")) {
                if (requestDate.isBefore(startDate)
                        || requestDate.isAfter(endDate)) {
                    continue;
                }
            }

            EmployeeRequestSummaryDTO summary = new EmployeeRequestSummaryDTO(
                    request.getId(),
                    request.getRequestStatus(),
                    request.getRequestDateTime(),
                    request.getClient().getName(),
                    request.getEquipmentDescription()
            );

            result.add(summary);
        }

        result.sort(
                Comparator.comparing(EmployeeRequestSummaryDTO::requestDateTime)
        );

        return result;
    }



    //DETALHES DA SOLICITACAO PARA EMPLOYEE VER
    @Transactional(readOnly = true)
    public EmployeeRequestDetailsDTO findByIdForEmployee(
            Long requestId,
            Long employeeId
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

        if (!canEmployeeSee(request, employeeId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Solicitação não encontrada."
            );
        }

        Client client = request.getClient();
        Address address = client.getAddress();

        AddressDTO addressDTO = null;

        if (address != null) {
            addressDTO = new AddressDTO(
                    address.getZipCode(),
                    address.getStreet(),
                    address.getNumber(),
                    address.getComplement(),
                    address.getNeighborhood(),
                    address.getCity(),
                    address.getState()
            );
        }

        ClientResponseDTO clientDTO = new ClientResponseDTO(
                client.getId(),
                client.getCpf(),
                client.getName(),
                client.getEmail(),
                client.getPhone(),
                addressDTO
        );

        QuoteDTO quoteDTO = null;
        PaymentDTO paymentDTO = null;
        Quote quote = request.getQuote();

        if (quote != null) {
            String employeeName = null;

            if (quote.getEmployee() != null) {
                employeeName = quote.getEmployee().getName();
            }

            quoteDTO = new QuoteDTO(
                    quote.getPrice(),
                    quote.getQuoteDateTime(),
                    employeeName
            );

            Payment payment = quote.getPayment();

            if (payment != null) {
                paymentDTO = new PaymentDTO(
                        payment.getAmount(),
                        payment.getPaymentDateTime()
                );
            }
        }

        MaintenanceDTO maintenanceDTO = null;
        Maintenance maintenance = request.getMaintenance();

        if (maintenance != null) {
            String employeeName = null;

            if (maintenance.getEmployee() != null) {
                employeeName = maintenance.getEmployee().getName();
            }

            maintenanceDTO = new MaintenanceDTO(
                    maintenance.getMaintenanceDescription(),
                    maintenance.getClienteInstructions(),
                    maintenance.getMaintenanceDateTime(),
                    employeeName
            );
        }

        List<EmployeeRequestHistoryDTO> historyDTO = new ArrayList<>();

        if (request.getRequestHistory() != null) {
            for (RequestHistory history : request.getRequestHistory()) {
                String performedByName = null;

                if (history.getPerformedBy() != null) {
                    performedByName = history.getPerformedBy().getName();
                }

                RedirectDTO redirectDTO = null;
                Redirect redirect = history.getRedirect();

                if (redirect != null) {
                    String sourceName = null;
                    String destinationName = null;

                    if (redirect.getSourceEmployee() != null) {
                        sourceName = redirect.getSourceEmployee().getName();
                    }

                    if (redirect.getDestinationEmployee() != null) {
                        destinationName = redirect.getDestinationEmployee().getName();
                    }

                    redirectDTO = new RedirectDTO(
                            sourceName,
                            destinationName
                    );
                }

                historyDTO.add(new EmployeeRequestHistoryDTO(
                        history.getId(),
                        history.getActions(),
                        history.getPreviousStatus(),
                        history.getNewStatus(),
                        history.getChangeDateTime(),
                        performedByName,
                        redirectDTO,
                        history.getRejectionReason()
                ));
            }
        }

        historyDTO.sort(
                Comparator.comparing(EmployeeRequestHistoryDTO::changeDateTime)
                        .thenComparing(EmployeeRequestHistoryDTO::requestHistoryId)
        );

        return new EmployeeRequestDetailsDTO(
                request.getId(),
                request.getEquipmentDescription(),
                request.getDefectDescription(),
                request.getRequestDateTime(),
                request.getRequestStatus(),
                request.getCategory().getName(),
                clientDTO,
                quoteDTO,
                maintenanceDTO,
                paymentDTO,
                historyDTO
        );
    }


    //RESGATAR SOLICITACAO
    @Transactional
    public ApiResponse<Void> rescue(Long requestId, Long clientId) {

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

        if (request.getRequestStatus() != RequestStatus.REJECTED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Só é possível resgatar uma solicitação rejeitada."
            );
        }

        request.setRequestStatus(RequestStatus.APPROVED);
        maintenanceRequestRepository.save(request);

        RequestHistory history = new RequestHistory();
        history.setMaintenanceRequest(request);
        history.setActions(HistoryActions.REQUEST_RESCUED);
        history.setPreviousStatus(RequestStatus.REJECTED);
        history.setNewStatus(RequestStatus.APPROVED);
        history.setChangeDateTime(Instant.now());
        history.setPerformedBy(request.getClient());

        requestHistoryRepository.save(history);

        return new ApiResponse<>(
                "Solicitação resgatada com sucesso.",
                true
        );
    }


    //FINALIZAR PEDIDO - employee
    @Transactional
    public ApiResponse<Void> finalizeRequest(
            Long requestId,
            Long employeeId
    ) {
        if (employeeId == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Entre como funcionário."
            );
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Funcionário não encontrado. Faça login novamente."
                ));

        MaintenanceRequest request = maintenanceRequestRepository
                .findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Solicitação não encontrada."
                ));

        if (request.getRequestStatus() != RequestStatus.PAID) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Só é possível finalizar uma solicitação paga."
            );
        }

        request.setRequestStatus(RequestStatus.FINALIZED);
        maintenanceRequestRepository.save(request);

        RequestHistory history = new RequestHistory();
        history.setMaintenanceRequest(request);
        history.setActions(HistoryActions.REQUEST_FINALIZED);
        history.setPreviousStatus(RequestStatus.PAID);
        history.setNewStatus(RequestStatus.FINALIZED);
        history.setChangeDateTime(Instant.now());
        history.setPerformedBy(employee);

        requestHistoryRepository.save(history);

        return new ApiResponse<>(
                "Solicitação finalizada com sucesso.",
                true
        );
    }



    //FUNCAO A PARTE ---

    public boolean canEmployeeSee(
            MaintenanceRequest request,
            Long employeeId
    ) {
        if (request.getRequestStatus() != RequestStatus.REDIRECTED) {
            return true;
        }

        if (request.getRequestHistory() == null) {
            return false;
        }

        RequestHistory last = null;

        for (RequestHistory history : request.getRequestHistory()) {
            if (history.getActions() != HistoryActions.MAINTENANCE_REDIRECTED) {
                continue;
            }

            if (last == null) {
                last = history;
            } else if (history.getChangeDateTime().isAfter(last.getChangeDateTime())) {
                last = history;
            } else if (history.getChangeDateTime().equals(last.getChangeDateTime())
                    && history.getId() > last.getId()) {
                last = history;
            }
        }

        if (last == null || last.getRedirect() == null) {
            return false;
        }

        Employee destination = last.getRedirect().getDestinationEmployee();

        if (destination == null) {
            return false;
        }

        return destination.getId() == employeeId;
    }




}
