package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.entities.*;
import com.web2.trabalhoFinal.entities.enums.HistoryActions;
import com.web2.trabalhoFinal.entities.enums.RequestStatus;
import com.web2.trabalhoFinal.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final RequestHistoryRepository requestHistoryRepository;

    public PaymentService(
            PaymentRepository paymentRepository,
            MaintenanceRequestRepository maintenanceRequestRepository,
            RequestHistoryRepository requestHistoryRepository
    ) {
        this.paymentRepository = paymentRepository;
        this.maintenanceRequestRepository = maintenanceRequestRepository;
        this.requestHistoryRepository = requestHistoryRepository;
    }

    @Transactional
    public ApiResponse<Void> pay(Long requestId, Long clientId) {

        if (clientId == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Entre como cliente."
            );
        }

        MaintenanceRequest request = maintenanceRequestRepository
                .findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Solicitação não encontrada."
                ));

        if (request.getClient().getId() != clientId) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Solicitação não encontrada."
            );
        }

        if (request.getRequestStatus() != RequestStatus.FIXED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Só é possível pagar uma solicitação arrumada."
            );
        }

        Quote quote = request.getQuote();

        if (quote == null || quote.getPrice() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A solicitação não possui um orçamento válido."
            );
        }

        if (quote.getPayment() != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Um pagamento já foi registrado."
            );
        }

        Instant date = Instant.now();

        Payment payment = new Payment();
        payment.setDescription("Pagamento da solicitação " + requestId);
        payment.setAmount(quote.getPrice());
        payment.setPaymentDateTime(date);
        payment.setQuote(quote);

        Payment saved = paymentRepository.save(payment);
        quote.setPayment(saved);

        request.setRequestStatus(RequestStatus.PAID);
        maintenanceRequestRepository.save(request);

        RequestHistory history = new RequestHistory();
        history.setMaintenanceRequest(request);
        history.setActions(HistoryActions.PAYMENT_CONFIRMED);
        history.setPreviousStatus(RequestStatus.FIXED);
        history.setNewStatus(RequestStatus.PAID);
        history.setChangeDateTime(date);
        history.setPerformedBy(request.getClient());

        requestHistoryRepository.save(history);

        return new ApiResponse<>(
                "Pagamento registrado com sucesso.",
                true
        );
    }
}