package com.web2.trabalhoFinal.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name="payment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_payment;

    private String description;

    private BigDecimal amount;

    private Instant paymentDateTime;

    @OneToOne
    @JoinColumn(name = "id_quote", nullable = false, unique = true)
    private Quote quote;

}