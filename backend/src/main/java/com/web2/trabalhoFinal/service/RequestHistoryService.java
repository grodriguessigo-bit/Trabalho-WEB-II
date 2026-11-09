package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.entities.RequestHistory;
import com.web2.trabalhoFinal.repository.RequestHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RequestHistoryService {

    private final RequestHistoryRepository requestHistoryRepository;

    public RequestHistoryService(RequestHistoryRepository requestHistoryRepository) {
        this.requestHistoryRepository = requestHistoryRepository;
    }

    @Transactional
    public ApiResponse<RequestHistory> salvar(RequestHistory requestHistory) {
        RequestHistory salvo = requestHistoryRepository.save(requestHistory);
        return new ApiResponse<>(salvo, "Histórico salvo com sucesso", true);
    }
}
