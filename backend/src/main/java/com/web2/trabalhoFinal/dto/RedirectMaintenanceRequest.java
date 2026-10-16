package com.web2.trabalhoFinal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RedirectMaintenanceRequest {

    @NotNull(message = "O ID da solicitação de manutenção é obrigatório")
    private Long requestId;

    @NotNull(message = "O ID do funcionário de destino é obrigatório")
    private Long destinationEmployeeId;

    @NotBlank(message = "A justificativa/motivo do redirecionamento é obrigatória")
    private String reason;

    public RedirectMaintenanceRequest() {}

    public RedirectMaintenanceRequest(Long requestId, Long destinationEmployeeId, String reason) {
        this.requestId = requestId;
        this.destinationEmployeeId = destinationEmployeeId;
        this.reason = reason;
    }

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public Long getDestinationEmployeeId() {
        return destinationEmployeeId;
    }

    public void setDestinationEmployeeId(Long destinationEmployeeId) {
        this.destinationEmployeeId = destinationEmployeeId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}