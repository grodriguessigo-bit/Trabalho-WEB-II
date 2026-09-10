package com.web2.trabalhoFinal.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name="quote")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Quote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_quote;

    @Column(nullable = false)
    private BigDecimal price;


    @Column(nullable = false)
    private Instant quoteDateTime;

    //maintencenceRequest View later

    @ManyToOne
    @JoinColumn(name="id_employee", nullable = false)
    private Employee employee;

    @OneToOne(mappedBy = "quote")
    private Payment payment;

}
