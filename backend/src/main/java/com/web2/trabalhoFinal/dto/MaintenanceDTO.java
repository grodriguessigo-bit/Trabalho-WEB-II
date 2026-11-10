package com.web2.trabalhoFinal.dto;

import java.time.Instant;

public record MaintenanceDTO(
        String maintenanceDescription,
        String clientInstructions,
        Instant maintenanceDateTime,
        String employeeName
) {}