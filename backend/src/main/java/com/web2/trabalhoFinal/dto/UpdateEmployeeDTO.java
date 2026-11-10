package com.web2.trabalhoFinal.dto;

import java.time.LocalDate;

public record UpdateEmployeeDTO(
        String name,
        String email,
        LocalDate birthDate,
        String newPassword
) {}