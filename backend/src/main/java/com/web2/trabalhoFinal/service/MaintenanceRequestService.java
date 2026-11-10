package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.CreateMaintenanceRequest;
import com.web2.trabalhoFinal.entities.*;
import com.web2.trabalhoFinal.entities.enums.HistoryActions;
import com.web2.trabalhoFinal.entities.enums.RequestStatus;
import com.web2.trabalhoFinal.exception.InvalidMaintenanceRequestException;
import com.web2.trabalhoFinal.repository.CategoryRepository;
import com.web2.trabalhoFinal.repository.ClientRepository;
import com.web2.trabalhoFinal.repository.MaintenanceRequestRepository;
import com.web2.trabalhoFinal.repository.RequestHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
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

//
//    public ApiResponse<List<MaintenanceRequest>> findAllClientRequest(){
//
//
//    }



}
