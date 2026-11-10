package com.web2.trabalhoFinal.dto;

public record ClientRegistrationDTO(
        String cpf,
        String name,
        String email,
        String phone,
        AddressDTO address
) {}