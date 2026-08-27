package com.web2.trabalhoFinal.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "usuarios")
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String cpf;

    @NotBlank
    @Column(nullable = false)
    private String nome;

    @NotBlank
    @Email
    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String senhaAleatoria; 

    @NotBlank
    private String telefone;

    @NotBlank
    private String cep;
    @NotBlank
    private String logradouro;
    @NotBlank
    private String bairro;
    @NotBlank
    private String localidade; 
    @NotBlank
    private String uf;        
    private String complemento;
    private String numero;     
}
