package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.entities.Payment;
import com.web2.trabalhoFinal.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public ApiResponse<Payment> salvar(Payment payment) {
        Payment salvo = paymentRepository.save(payment);
        return new ApiResponse<>(salvo, "Pagamento salvo com sucesso", true);
    }
}
