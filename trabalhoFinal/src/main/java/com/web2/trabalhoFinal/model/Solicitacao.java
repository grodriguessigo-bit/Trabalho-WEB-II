package com.web2.trabalhoFinal.model;

import com.web2.trabalhoFinal.model.enums.EstadoSolicitacao;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;

@Entity
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricaoEquipamento;

    @ManyToOne
    private Category categoria;

    private String descricaoDefeito;

    private LocalDateTime dataHora = LocalDateTime.now();

    private EstadoSolicitacao estado = EstadoSolicitacao.ABERTA;

    public Solicitacao() {
    }

    public Solicitacao(String descricaoEquipamento, Category categoria, String descricaoDefeito) {
        this.descricaoEquipamento = descricaoEquipamento;
        this.categoria = categoria;
        this.descricaoDefeito = descricaoDefeito;
        this.dataHora = LocalDateTime.now();
        this.estado = EstadoSolicitacao.ABERTA;
    }

    public Long getId() {
        return id;
    }

    public String getDescricaoEquipamento() {
        return descricaoEquipamento;
    }

    public void setDescricaoEquipamento(String descricaoEquipamento) {
        this.descricaoEquipamento = descricaoEquipamento;
    }

    public Category getCategoria() {
        return categoria;
    }

    public void setCategoria(Category categoria) {
        this.categoria = categoria;
    }

    public String getDescricaoDefeito() {
        return descricaoDefeito;
    }

    public void setDescricaoDefeito(String descricaoDefeito) {
        this.descricaoDefeito = descricaoDefeito;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public EstadoSolicitacao getEstado() {
        return estado;
    }

    public void setEstado(EstadoSolicitacao estado) {
        this.estado = estado;
    }
}
