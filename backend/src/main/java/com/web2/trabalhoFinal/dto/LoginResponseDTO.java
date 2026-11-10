package com.web2.trabalhoFinal.dto;

public record LoginResponseDTO(
        Long userId,
        String name,
        String email,
        String profile
) {}