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


    public ClientService(ClientRepository clientRepository, PersonRepository personRepository) {
        this.clientRepository = clientRepository;
        this.personRepository = personRepository;
    }

    @Transactional
    public ApiResponse<Client> salvar(Client client) {
        try {
            if(clientRepository.existsByCpf(client.getCpf()))
                return new ApiResponse<>("Cpf já existente", false);
            if(personRepository.existsByEmailAndOtherId(client.getEmail(), client.getId()))
                return new ApiResponse<>("Email Já cadastrado", false);

            Client salvo = clientRepository.save(client);
            return new ApiResponse<>(salvo, "Cliente salvo com sucesso", true);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}