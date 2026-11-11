package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.entities.Client;
import com.web2.trabalhoFinal.repository.ClientRepository;
import com.web2.trabalhoFinal.repository.PersonRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final PersonRepository personRepository;
    private final PasswordService passwordService;
    private final EmailService emailService;

    public ClientService(
            ClientRepository clientRepository,
            PersonRepository personRepository,
            PasswordService passwordService,
            EmailService emailService
    ) {
        this.clientRepository = clientRepository;
        this.personRepository = personRepository;
        this.passwordService = passwordService;
        this.emailService = emailService;
    }

    @Transactional
    public ApiResponse<Client> salvar(Client client) {
        try {
            if (clientRepository.existsByCpf(client.getCpf())) {
                return new ApiResponse<>("CPF já existente", false);
            }

            if (personRepository.existsByEmailAndOtherId(
                    client.getEmail(), client.getId())) {
                return new ApiResponse<>("E-mail já cadastrado", false);
            }

            String password = passwordService.generatePassword();
            String salt = passwordService.generateSalt();

            client.setSalt(salt);
            client.setPassword(passwordService.hashPassword(password, salt));

            Client salvo = clientRepository.saveAndFlush(client);

            emailService.enviarSenhaCadastro(salvo.getEmail(), password);

            System.out.println("Senha: " + password + "enviada para" + salvo.getEmail());

            return new ApiResponse<>(
                salvo, "Cliente salvo com sucesso", true
            );
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}