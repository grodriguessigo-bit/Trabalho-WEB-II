package com.web2.trabalhoFinal.controller;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.LoginRequestDTO;
import com.web2.trabalhoFinal.dto.LoginResponseDTO;
import com.web2.trabalhoFinal.service.LoginService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(
        origins = "http://localhost:4200",
        allowCredentials = "true"
)
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> login(
            @RequestBody(required = false) LoginRequestDTO dados,
            HttpServletRequest request
    ) {
        HttpSession anterior = request.getSession(false);

        if (anterior != null) {
            anterior.invalidate();
        }

        ApiResponse<LoginResponseDTO> resposta = loginService.login(dados);

        if (!resposta.isSuccess()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resposta);
        }

        LoginResponseDTO usuario = resposta.getData();
        HttpSession session = request.getSession(true);

        session.setAttribute("userId", usuario.userId());
        session.setAttribute("profile", usuario.profile());
        session.setAttribute("name", usuario.name());
        session.setAttribute("email", usuario.email());

        if ("CLIENT".equals(usuario.profile())) {
            session.setAttribute("clientId", usuario.userId());
        } else {
            session.setAttribute("employeeId", usuario.userId());
        }

        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/session")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> session(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("userId") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>("Sessão não encontrada.", false));
        }

        Long userId = (Long) session.getAttribute("userId");
        String profile = (String) session.getAttribute("profile");
        String name = (String) session.getAttribute("name");
        String email = (String) session.getAttribute("email");

        LoginResponseDTO usuario = new LoginResponseDTO(userId, name, email, profile);

        return ResponseEntity.ok(new ApiResponse<>(usuario, "Sessão restaurada com sucesso.", true));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        return ResponseEntity.noContent().build();
    }
}
