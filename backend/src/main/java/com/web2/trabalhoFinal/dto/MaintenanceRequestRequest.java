package com.web2.trabalhoFinal.dto;

public record MaintenanceRequestRequest(
        String equipmentDescription,
        String defectDescription,
        Long clientId,
        Long categoryId) {
}
