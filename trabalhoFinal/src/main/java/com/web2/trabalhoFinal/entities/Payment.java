package com.web2.trabalhoFinal.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPayment;

    private BigDecimal amount;

    private Instant paymentDateTime;

    public Payment() {
    }

    public Payment(BigDecimal amount, Instant paymentDateTime) {
        this.amount = amount;
        this.paymentDateTime = paymentDateTime;
    }

    public Long getIdPayment() {
        return idPayment;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Instant getPaymentDateTime() {
        return paymentDateTime;
    }

    public void setPaymentDateTime(Instant paymentDateTime) {
        this.paymentDateTime = paymentDateTime;
    }

}