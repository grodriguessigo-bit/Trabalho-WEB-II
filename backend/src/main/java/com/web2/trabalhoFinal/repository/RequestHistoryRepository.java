package com.web2.trabalhoFinal.repository;

import com.web2.trabalhoFinal.entities.RequestHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestHistoryRepository extends JpaRepository<RequestHistory, Long> {
}
