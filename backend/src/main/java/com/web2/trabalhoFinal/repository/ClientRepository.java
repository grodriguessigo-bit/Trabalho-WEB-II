package com.web2.trabalhoFinal.repository;

import com.web2.trabalhoFinal.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
}
