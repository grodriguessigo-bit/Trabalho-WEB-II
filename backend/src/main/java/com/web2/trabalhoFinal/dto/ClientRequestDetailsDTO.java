package com.web2.trabalhoFinal.dto;

import com.web2.trabalhoFinal.entities.enums.RequestStatus;

import java.time.Instant;
import java.util.List;

public record ClientRequestDetailsDTO(
        Long requestId,
        String equipmentDescription,
        String defectDescription,
        Instant requestDateTime,
        RequestStatus status,
        String categoryName,
        QuoteDTO quote,
        MaintenanceDTO maintenance,
        PaymentDTO payment,
        List<ClientRequestHistoryDTO> history
) {}