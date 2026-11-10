package com.web2.trabalhoFinal.dto;

public record AddressDTO(
        String zipCode,
        String street,
        String number,
        String complement,
        String neighborhood,
        String city,
        String state
) {}