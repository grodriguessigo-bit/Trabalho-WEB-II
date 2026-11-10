package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.entities.Client;
import com.web2.trabalhoFinal.repository.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClientService {

    private final ClientRepository clienteRepository;

    public ClientService(ClientRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Transactional
    public ApiResponse<Client> salvar(Client client) {
        Client salvo = clienteRepository.save(client);
        return new ApiResponse<>(salvo, "Cliente salvo com sucesso", true);
    }
}