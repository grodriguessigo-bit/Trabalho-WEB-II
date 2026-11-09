package com.web2.trabalhoFinal.repository;

import com.web2.trabalhoFinal.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
