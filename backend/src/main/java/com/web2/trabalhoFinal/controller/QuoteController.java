package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.*;
import com.web2.trabalhoFinal.service.EmployeePermission;
import com.web2.trabalhoFinal.service.QuoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/quotes")
@CrossOrigin(
        origins = "http://localhost:4200",
        allowCredentials = "true"
)
public class QuoteController {

    private final QuoteService quoteService;
    private final EmployeePermission employeePermission;

    public QuoteController(QuoteService quoteService, EmployeePermission employeePermission) {
        this.quoteService = quoteService;
        this.employeePermission = employeePermission;
    }

    @PostMapping("/request/{requestId}")
    public ResponseEntity<ApiResponse<QuoteDTO>> create(
            @PathVariable Long requestId,
            @SessionAttribute(name = "employeeId", required = false)
            Long employeeId,
            @RequestBody CreateQuoteDTO dto
    ) {
        employeePermission.verificar(employeeId);
        ApiResponse<QuoteDTO> response = quoteService.create(
                requestId,
                employeeId,
                dto
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @GetMapping("/request/{requestId}")
    public ResponseEntity<ApiResponse<QuoteDTO>> findByRequestId(
            @PathVariable Long requestId,
            @SessionAttribute(name = "clientId", required = false)
            Long clientId
    ) {
        QuoteDTO quote = quoteService.findByRequestId(requestId, clientId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        quote,
                        "Orçamento consultado com sucesso.",
                        true
                )
        );
    }

    @PostMapping("/request/{requestId}/approve")
    public ResponseEntity<ApiResponse<Void>> approve(
            @PathVariable Long requestId,
            @SessionAttribute(name = "clientId", required = false)
            Long clientId
    ) {
        ApiResponse<Void> response = quoteService.approve(
                requestId,
                clientId
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/request/{requestId}/reject")
    public ResponseEntity<ApiResponse<Void>> reject(
            @PathVariable Long requestId,
            @SessionAttribute(name = "clientId", required = false)
            Long clientId,
            @RequestBody RejectQuoteDTO dto
    ) {
        ApiResponse<Void> response = quoteService.reject(
                requestId,
                clientId,
                dto
        );

        return ResponseEntity.ok(response);
    }
}