package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.entities.Quote;
import com.web2.trabalhoFinal.service.QuoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quotes")
@CrossOrigin(origins = "http://localhost:4200")
public class QuoteController {

    private final QuoteService quoteService;

    public QuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    public record CreateQuoteRequest(Long requestId, BigDecimal amount, String description) {}

    @GetMapping
    public List<Quote> listAll() {
        return quoteService.findAll();
    }

    @GetMapping("/{id}")
    public Quote findById(@PathVariable Long id) {
        return quoteService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody CreateQuoteRequest request) {
        Quote created = quoteService.create(request.requestId(), request.amount(), request.description());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("id", created.getId(), "message", "Orçamento gerado com sucesso."));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Map<String, String>> approve(@PathVariable Long id) {
        quoteService.approve(id);
        return ResponseEntity.ok(Map.of("message", "Orçamento aprovado pelo cliente com sucesso."));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Map<String, String>> reject(@PathVariable Long id, @RequestBody Map<String, String> body) {
        quoteService.reject(id, body.getOrDefault("reason", "Sem justificativa."));
        return ResponseEntity.ok(Map.of("message", "Orçamento rejeitado com sucesso."));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
    }
}