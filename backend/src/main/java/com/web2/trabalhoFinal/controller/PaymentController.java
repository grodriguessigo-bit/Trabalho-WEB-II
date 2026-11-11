package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@CrossOrigin(
        origins = "http://localhost:4200",
        allowCredentials = "true"
)
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/request/{requestId}")
    public ResponseEntity<ApiResponse<Void>> pay(
            @PathVariable Long requestId,
            @SessionAttribute(name = "clientId", required = false)
            Long clientId
    ) {
        ApiResponse<Void> response = paymentService.pay(
                requestId,
                clientId
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}