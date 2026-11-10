package com.web2.trabalhoFinal.dto;

public record ClientResponseDTO(
        Long clientId,
        String cpf,
        String name,
        String email,
        String phone,
        AddressDTO address
) {}