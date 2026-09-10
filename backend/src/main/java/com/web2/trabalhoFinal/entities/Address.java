package com.web2.trabalhoFinal.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="address")
@Getter
@Setter
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_address;

    @Column
    private String street;

    @Column
    private String number;

    @Column
    private String complement;

    @Column
    private String zipCode;

    @Column
    private String neighborhood;

    @Column
    private String city;

    @Column
    private String state;

}
