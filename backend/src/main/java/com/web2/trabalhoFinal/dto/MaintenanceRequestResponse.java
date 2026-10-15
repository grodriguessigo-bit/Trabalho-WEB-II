package com.web2.trabalhoFinal.dto;

import com.web2.trabalhoFinal.entities.MaintenanceRequest;
import com.web2.trabalhoFinal.entities.enums.RequestStatus;

import java.time.Instant;

public record MaintenanceRequestResponse(Long id, Long clientId, Long categoryId,
                                         String equipmentDescription, String defectDescription,
                                         Instant requestDateTime, RequestStatus status) {

    public static MaintenanceRequestResponse from(MaintenanceRequest request) {
        return new MaintenanceRequestResponse(
                request.getId(),
                request.getClient() == null ? null : request.getClient().getId_person(),
                request.getCategory() == null ? null : request.getCategory().getId(),
                request.getEquipmentDescription(),
                request.getDefectDescription(),
                request.getRequestDateTime(),
                request.getRequestStatus());
    }
}
