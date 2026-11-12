package com.web2.trabalhoFinal.service;

import br.com.caelum.stella.validation.CPFValidator;
import br.com.caelum.stella.validation.InvalidStateException;
import com.web2.trabalhoFinal.dto.AddressDTO;
import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.ClientRegistrationDTO;
import com.web2.trabalhoFinal.dto.ClientResponseDTO;
import com.web2.trabalhoFinal.entities.Address;
import com.web2.trabalhoFinal.entities.Client;
import com.web2.trabalhoFinal.repository.ClientRepository;
import com.web2.trabalhoFinal.repository.PersonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Service
public class ClientService {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

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
    public ApiResponse<ClientResponseDTO> salvar(ClientRegistrationDTO data) {
        String validationError = validate(data);

        if (validationError != null) {
            return new ApiResponse<>(validationError, false);
        }

        String cpf = onlyDigits(data.cpf());
        String email = data.email().trim().toLowerCase();
        String phone = onlyDigits(data.phone());

        if (clientRepository.existsByCpf(cpf)) {
            return new ApiResponse<>("CPF já cadastrado.", false);
        }

        if (personRepository.existsByEmail(email)) {
            return new ApiResponse<>("E-mail já cadastrado.", false);
        }

        AddressDTO addressData = data.address();

        Address address = new Address();
        address.setZipCode(onlyDigits(addressData.zipCode()));
        address.setStreet(addressData.street().trim());
        address.setNumber(addressData.number().trim());
        address.setComplement(
                addressData.complement() == null
                        ? ""
                        : addressData.complement().trim()
        );
        address.setNeighborhood(addressData.neighborhood().trim());
        address.setCity(addressData.city().trim());
        address.setState(addressData.state().trim().toUpperCase());

        Client client = new Client();
        client.setCpf(cpf);
        client.setName(data.name().trim());
        client.setEmail(email);
        client.setPhone(phone);
        client.setAddress(address);
        client.setActive(true);

        String password = passwordService.generatePassword();
        String salt = passwordService.generateSalt();

        client.setSalt(salt);
        client.setPassword(
                passwordService.hashPassword(password, salt)
        );

        Client saved = clientRepository.saveAndFlush(client);

        emailService.enviarSenhaCadastro(
                saved.getEmail(),
                password
        );

        AddressDTO addressResponse = new AddressDTO(
                saved.getAddress().getZipCode(),
                saved.getAddress().getStreet(),
                saved.getAddress().getNumber(),
                saved.getAddress().getComplement(),
                saved.getAddress().getNeighborhood(),
                saved.getAddress().getCity(),
                saved.getAddress().getState()
        );

        ClientResponseDTO response = new ClientResponseDTO(
                saved.getId(),
                saved.getCpf(),
                saved.getName(),
                saved.getEmail(),
                saved.getPhone(),
                addressResponse
        );

        return new ApiResponse<>(
                response,
                "Cliente cadastrado com sucesso. A senha foi enviada por e-mail.",
                true
        );
    }

    private String validate(ClientRegistrationDTO data) {
        if (data == null) {
            return "Dados do cliente não informados.";
        }

        if (isBlank(data.name()) || data.name().trim().length() < 2) {
            return "Nome inválido.";
        }

        String cpf = onlyDigits(data.cpf());

        if (cpf.length() != 11 || !isValidCpf(cpf)) {
            return "CPF inválido.";
        }

        if (
                isBlank(data.email()) ||
                !EMAIL_PATTERN.matcher(data.email().trim()).matches()
        ) {
            return "E-mail inválido.";
        }

        String phone = onlyDigits(data.phone());

        if (phone.length() < 10 || phone.length() > 11) {
            return "Telefone inválido.";
        }

        if (data.address() == null) {
            return "Endereço não informado.";
        }

        AddressDTO address = data.address();

        if (onlyDigits(address.zipCode()).length() != 8) {
            return "CEP inválido.";
        }

        if (
                isBlank(address.street()) ||
                isBlank(address.number()) ||
                isBlank(address.neighborhood()) ||
                isBlank(address.city()) ||
                isBlank(address.state()) ||
                address.state().trim().length() != 2
        ) {
            return "Endereço incompleto.";
        }

        return null;
    }

    private boolean isValidCpf(String cpf) {
        try {
            new CPFValidator(false).assertValid(cpf);
            return true;
        } catch (InvalidStateException e) {
            return false;
        }
    }

    private String onlyDigits(String value) {
        return value == null
                ? ""
                : value.replaceAll("\\D", "");
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}