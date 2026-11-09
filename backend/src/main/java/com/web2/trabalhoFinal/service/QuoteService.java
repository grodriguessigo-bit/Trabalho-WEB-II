package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.entities.Quote;
import com.web2.trabalhoFinal.repository.QuoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class QuoteService {

    private final QuoteRepository quoteRepository;

    public QuoteService(QuoteRepository quoteRepository) {
        this.quoteRepository = quoteRepository;
    }

    @Transactional
    public ApiResponse<Quote> salvar(Quote quote) {
        Quote salvo = quoteRepository.save(quote);
        return new ApiResponse<>(salvo, "Orçamento salvo com sucesso", true);
    }
}
