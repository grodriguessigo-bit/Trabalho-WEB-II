package com.web2.trabalhoFinal.dto;

import com.web2.trabalhoFinal.entities.enums.RequestStatus;

import java.time.Instant;
import java.util.List;

public record EmployeeRequestDetailsDTO(
        Long requestId,
        String equipmentDescription,
        String defectDescription,
        Instant requestDateTime,
        RequestStatus status,
        String categoryName,
        ClientResponseDTO client,
        QuoteDTO quote,
        MaintenanceDTO maintenance,
        PaymentDTO payment,
        List<EmployeeRequestHistoryDTO> history
) {}