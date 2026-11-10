package com.web2.trabalhoFinal.dto;

import java.time.LocalDate;

public record CreateEmployeeDTO(
        String name,
        String email,
        LocalDate birthDate,
        String password
) {}