package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.QuoteDTO;
import com.web2.trabalhoFinal.entities.MaintenanceRequest;
import com.web2.trabalhoFinal.entities.Quote;
import com.web2.trabalhoFinal.exception.InvalidMaintenanceRequestException;
import com.web2.trabalhoFinal.repository.MaintenanceRequestRepository;
import com.web2.trabalhoFinal.repository.QuoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class QuoteService {

    private final QuoteRepository quoteRepository;
    private final MaintenanceRequestRepository maintenanceRequestRepository;

    public QuoteService(QuoteRepository quoteRepository, MaintenanceRequestRepository maintenanceRequestRepository) {
        this.quoteRepository = quoteRepository;
        this.maintenanceRequestRepository = maintenanceRequestRepository;
    }

    @Transactional
    public ApiResponse<Quote> salvar(Quote quote) {
        Quote salvo = quoteRepository.save(quote);
        return new ApiResponse<>(salvo, "Orçamento salvo com sucesso", true);
    }

    @Transactional(readOnly = true)
    public ApiResponse<QuoteDTO> buscarPorSolicitacaoId(Long requestId, Long loggedClientId) {
        MaintenanceRequest request = maintenanceRequestRepository.findById(requestId).orElseThrow(() -> new InvalidMaintenanceRequestException("Solicitação não encontrada."));

        if (!java.util.Objects.equals(request.getClient().getId(), loggedClientId)) {
            throw new RuntimeException("Acesso negado: a solicitação pertence a outro usuário.");
        }

        Quote quote = request.getQuote();
        if (quote == null) {
            throw new InvalidMaintenanceRequestException("Orçamento ainda não cadastrado para esta solicitação.");
        }

        String nomeFuncionario = (quote.getEmployee() != null) ? quote.getEmployee().getName() : "Técnico Responsável";
        QuoteDTO dto = new QuoteDTO(
                quote.getPrice(),quote.getQuoteDateTime(), nomeFuncionario);

        return new ApiResponse<>(dto, "Orçamento encontrado com sucesso", true);
    }
}

