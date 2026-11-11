package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.QuoteDTO;
import com.web2.trabalhoFinal.entities.Quote;
import com.web2.trabalhoFinal.service.QuoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/quotes")
@CrossOrigin(origins = "http://localhost:4200")
public class QuoteController {

    private final QuoteService quoteService;

    public QuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Quote>> salvar(@RequestBody Quote quote) {
        ApiResponse<Quote> resposta = quoteService.salvar(quote);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    @GetMapping("/request/{requestId}")
    public ResponseEntity<ApiResponse<QuoteDTO>> getQuoteByRequestId(
            @PathVariable Long requestId,
            @RequestHeader("X-Client-Id") Long loggedClientId) {

        ApiResponse<QuoteDTO> response = quoteService.buscarPorSolicitacaoId(requestId, loggedClientId);
        return ResponseEntity.ok(response);
    }
}
