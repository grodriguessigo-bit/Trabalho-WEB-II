package com.web2.trabalhoFinal.dto;

public record CreateMaintenanceRequest(
    String equipmentDescription,
    String defectDescription,
    Long categoryId
) {}



