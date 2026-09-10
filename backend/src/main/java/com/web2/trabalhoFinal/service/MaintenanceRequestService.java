package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.MaintenanceRequestRequest;
import com.web2.trabalhoFinal.entities.Category;
import com.web2.trabalhoFinal.entities.MaintenanceRequest;
import com.web2.trabalhoFinal.entities.enums.RequestStatus;
import com.web2.trabalhoFinal.repository.CategoryRepository;
import com.web2.trabalhoFinal.repository.ClientRepository;
import com.web2.trabalhoFinal.repository.MaintenanceRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class MaintenanceRequestService {

    private final MaintenanceRequestRepository requestRepository;
    private final ClientRepository clientRepository;
    private final CategoryRepository categoryRepository;

    public MaintenanceRequestService(MaintenanceRequestRepository requestRepository,
                                     ClientRepository clientRepository, CategoryRepository categoryRepository) {
        this.requestRepository = requestRepository;
        this.clientRepository = clientRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public MaintenanceRequest create(MaintenanceRequestRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Os dados da solicitação são obrigatórios.");
        }

        String equipment = required(request.equipmentDescription(), "A descrição do equipamento é obrigatória.");
        if (equipment.length() > 30) {
            throw new IllegalArgumentException("A descrição do equipamento deve ter no máximo 30 caracteres.");
        }
        String defect = required(request.defectDescription(), "A descrição do defeito é obrigatória.");
        var client = clientRepository.findById(requiredId(request.clientId(), "O cliente é obrigatório."))
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));
        Category category = categoryRepository.findById(requiredId(request.categoryId(), "A categoria é obrigatória."))
                .filter(Category::isActive)
                .orElseThrow(() -> new IllegalArgumentException("Categoria ativa não encontrada."));

        MaintenanceRequest entity = new MaintenanceRequest(null, equipment, defect, Instant.now(),
                RequestStatus.OPEN, client, category, null, null, null);
        return requestRepository.save(entity);
    }

    private String required(String value, String message) {
        if (value == null || value.isBlank()) throw new IllegalArgumentException(message);
        return value.trim();
    }

    private Long requiredId(Long value, String message) {
        if (value == null) throw new IllegalArgumentException(message);
        return value;
    }
}
