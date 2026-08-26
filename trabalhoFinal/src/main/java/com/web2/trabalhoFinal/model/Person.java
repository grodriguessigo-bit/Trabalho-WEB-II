package com.web2.trabalhoFinal.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import javax.annotation.processing.Generated;

@Entity
@Table(name="person")

public abstract class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_person;

    @Setter
    @Column(nullable = false)
    private String name;

    @Getter
    @Setter
    @Column(nullable = false)
    private String cpf;


    @Getter
    @Setter
    @OneToOne
    @JoinColumn(name = "id_address")
    private Address id_address; //chave estrangeira de address, fazendo o vinculo de cliente com endereço.

    @Getter
    @Setter
    @Column(nullable = false)
    private String phone;


}
