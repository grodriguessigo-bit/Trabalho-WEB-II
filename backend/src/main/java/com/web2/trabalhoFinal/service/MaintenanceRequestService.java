package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.entities.MaintenanceRequest;
import com.web2.trabalhoFinal.repository.MaintenanceRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MaintenanceRequestService {

    private final MaintenanceRequestRepository maintenanceRequestRepository;

    public MaintenanceRequestService(MaintenanceRequestRepository maintenanceRequestRepository) {
        this.maintenanceRequestRepository = maintenanceRequestRepository;
    }

    @Transactional
    public ApiResponse<MaintenanceRequest> salvar(MaintenanceRequest maintenanceRequest) {
        MaintenanceRequest salvo = maintenanceRequestRepository.save(maintenanceRequest);
        return new ApiResponse<>(salvo, "Solicitação de manutenção salva com sucesso", true);
    }
}
