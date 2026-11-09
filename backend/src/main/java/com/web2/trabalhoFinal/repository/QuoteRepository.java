package com.web2.trabalhoFinal.repository;

import com.web2.trabalhoFinal.entities.Quote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuoteRepository extends JpaRepository<Quote, Long> {
}
