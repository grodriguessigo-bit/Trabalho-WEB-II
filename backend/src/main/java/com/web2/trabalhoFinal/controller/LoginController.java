package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.LoginRequestDTO;
import com.web2.trabalhoFinal.dto.LoginResponseDTO;
import com.web2.trabalhoFinal.service.LoginService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> login(
            @RequestBody LoginRequestDTO dados) {
        ApiResponse<LoginResponseDTO> resposta = loginService.login(dados);

        if (!resposta.isSuccess()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resposta);
        }

        return ResponseEntity.ok(resposta);
    }
}