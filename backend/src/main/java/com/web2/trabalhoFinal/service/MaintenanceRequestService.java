package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.*;
import com.web2.trabalhoFinal.entities.*;
import com.web2.trabalhoFinal.entities.enums.HistoryActions;
import com.web2.trabalhoFinal.entities.enums.RequestStatus;
import com.web2.trabalhoFinal.exception.InvalidMaintenanceRequestException;
import com.web2.trabalhoFinal.repository.CategoryRepository;
import com.web2.trabalhoFinal.repository.ClientRepository;
import com.web2.trabalhoFinal.repository.MaintenanceRequestRepository;
import com.web2.trabalhoFinal.repository.RequestHistoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class MaintenanceRequestService {

    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final ClientRepository clientRepository;
    private final CategoryRepository categoryRepository;
    private final RequestHistoryRepository requestHistoryRepository;

    public MaintenanceRequestService(MaintenanceRequestRepository maintenanceRequestRepository, ClientRepository clientRepository, CategoryRepository categoryRepository, RequestHistoryRepository requestHistoryRepository) {
        this.maintenanceRequestRepository = maintenanceRequestRepository;
        this.clientRepository = clientRepository;
        this.categoryRepository = categoryRepository;
        this.requestHistoryRepository = requestHistoryRepository;
    }

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

    //sem validacao não precisa ser ApiResponse pode ser o Data direto
    public List<ClientRequestSummaryDTO> findAllRequestByClient(Long clientId){
        List<MaintenanceRequest> requests = maintenanceRequestRepository.findByClient_idOrderByRequestDateTimeAsc(clientId);

        return requests.stream()
        .map(request -> new ClientRequestSummaryDTO(
                request.getId(),
                request.getRequestDateTime(),
                request.getEquipmentDescription(),
                request.getRequestStatus()
        )).toList();
    }

    @Transactional(readOnly = true)
    public ClientRequestDetailsDTO findById (Long requestId, Long clientId){

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
            String employee = null;

            for(RequestHistory requestHistory : request.getRequestHistory()){

                if(requestHistory.getPerformedBy() != null){
                    employee = requestHistory.getPerformedBy().getName();
                }

                historyDTO.add(new ClientRequestHistoryDTO(
                        requestHistory.getId(),
                        requestHistory.getActions(),
                        requestHistory.getPreviousStatus(),
                        requestHistory.getNewStatus(),
                        requestHistory.getChangeDateTime(),
                        employee
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




}
