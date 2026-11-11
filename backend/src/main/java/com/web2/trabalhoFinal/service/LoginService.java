package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.LoginRequestDTO;
import com.web2.trabalhoFinal.dto.LoginResponseDTO;
import com.web2.trabalhoFinal.entities.Employee;
import com.web2.trabalhoFinal.entities.Person;
import com.web2.trabalhoFinal.repository.PersonRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoginService {

    private final PersonRepository personRepository;
    private final PasswordService passwordService;

    public LoginService(
            PersonRepository personRepository,
            PasswordService passwordService
    ) {
        this.personRepository = personRepository;
        this.passwordService = passwordService;
    }

    @Transactional
    public ApiResponse<LoginResponseDTO> login(LoginRequestDTO dados) {
        if (dados == null || dados.email() == null || dados.email().isBlank() || dados.password() == null || dados.password().isBlank()) {
            return new ApiResponse<>("Preencher login e/ou senha.", false);
        }

        Person pessoa = personRepository.findByEmail(dados.email().trim()).orElse(null);

        if (pessoa == null || !pessoa.isActive() || !passwordService.matches(dados.password(), pessoa.getPassword(), pessoa.getSalt())) {
            return new ApiResponse<>("Login e/ou senha inválidos.", false);
        }

        String perfil = pessoa instanceof Employee ? "EMPLOYEE" : "CLIENT";

        LoginResponseDTO resposta = new LoginResponseDTO(
                pessoa.getId(),
                pessoa.getName(),
                pessoa.getEmail(),
                perfil
        );

        return new ApiResponse<>(resposta, "Login realizado com sucesso.", true);
    }
}