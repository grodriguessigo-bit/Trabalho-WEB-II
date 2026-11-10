package com.web2.trabalhoFinal.dto;

import java.time.LocalDate;

public record EmployeeDTO(
        Long id,
        String name,
        String email,
        LocalDate birthDate,
        boolean active
) {}