package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.entities.Maintenance;
import com.web2.trabalhoFinal.repository.MaintenanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;

    public MaintenanceService(MaintenanceRepository maintenanceRepository) {
        this.maintenanceRepository = maintenanceRepository;
    }

    @Transactional
    public ApiResponse<Maintenance> salvar(Maintenance maintenance) {
        Maintenance salvo = maintenanceRepository.save(maintenance);
        return new ApiResponse<>(salvo, "Manutenção salva com sucesso", true);
    }
}
