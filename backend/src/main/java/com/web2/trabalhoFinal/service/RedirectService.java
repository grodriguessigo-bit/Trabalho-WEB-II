package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.entities.Redirect;
import com.web2.trabalhoFinal.repository.RedirectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RedirectService {

    private final RedirectRepository redirectRepository;

    public RedirectService(RedirectRepository redirectRepository) {
        this.redirectRepository = redirectRepository;
    }

    @Transactional
    public ApiResponse<Redirect> salvar(Redirect redirect) {
        Redirect salvo = redirectRepository.save(redirect);
        return new ApiResponse<>(salvo, "Redirecionamento salvo com sucesso", true);
    }
}
