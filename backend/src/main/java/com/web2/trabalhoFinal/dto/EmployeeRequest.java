package com.web2.trabalhoFinal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record EmployeeRequest(
        @NotBlank(message = "O nome do funcionário é obrigatório.")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres.")
        String name,

        @NotBlank(message = "O e-mail do funcionário é obrigatório.")
        @Email(message = "E-mail inválido.")
        @Size(max = 150, message = "O e-mail deve ter no máximo 150 caracteres.")
        String email,

        @NotNull(message = "A data de nascimento é obrigatória.")
        @Past(message = "A data de nascimento deve estar no passado.")
        LocalDate birthDate,

        String password) {
}