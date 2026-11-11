package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.RedirectMaintenanceDTO;
import com.web2.trabalhoFinal.service.PermissaoFuncionario;
import com.web2.trabalhoFinal.service.RedirectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/redirects")
@CrossOrigin(
        origins = "http://localhost:4200",
        allowCredentials = "true"
)
public class RedirectController {

    private final RedirectService redirectService;
    private final PermissaoFuncionario permissaoFuncionario;

    public RedirectController(RedirectService redirectService, PermissaoFuncionario permissaoFuncionario) {
        this.redirectService = redirectService;
        this.permissaoFuncionario = permissaoFuncionario;
    }

    @PostMapping("/request/{requestId}")
    public ResponseEntity<ApiResponse<Void>> redirect(
            @PathVariable Long requestId,
            @SessionAttribute(name = "employeeId", required = false)
            Long employeeId,
            @RequestBody RedirectMaintenanceDTO destinationId
    ) {
        permissaoFuncionario.verificar(employeeId);
        ApiResponse<Void> response = redirectService.redirect(
                requestId,
                employeeId,
                destinationId
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}