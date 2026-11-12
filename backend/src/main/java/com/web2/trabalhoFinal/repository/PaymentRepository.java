package com.web2.trabalhoFinal.repository;

import com.web2.trabalhoFinal.entities.Payment;
import com.web2.trabalhoFinal.repository.projection.CategoryRevenueProjection;
import com.web2.trabalhoFinal.repository.projection.DailyRevenueProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query(value = """
            SELECT CAST(p.payment_date_time AT TIME ZONE 'America/Sao_Paulo' AS date) AS report_date,
                   SUM(p.amount) AS total_amount
            FROM payment p
            WHERE (CAST(:startInstant AS timestamptz) IS NULL OR p.payment_date_time >= :startInstant)
              AND (CAST(:endInstant AS timestamptz) IS NULL OR p.payment_date_time <= :endInstant)
            GROUP BY CAST(p.payment_date_time AT TIME ZONE 'America/Sao_Paulo' AS date)
            ORDER BY report_date ASC
            """, nativeQuery = true)
    List<DailyRevenueProjection> findDailyRevenue(
            @Param("startInstant") Instant startInstant,
            @Param("endInstant") Instant endInstant
    );

    @Query(value = """
            SELECT c.id AS category_id,
                   c.name AS category_name,
                   COUNT(p.id_payment) AS paid_requests_count,
                   COALESCE(SUM(p.amount), 0) AS total_amount
            FROM category c
            LEFT JOIN maintenance_request mr ON mr.id_category = c.id
            LEFT JOIN quote q ON mr.id_quote = q.id_quote
            LEFT JOIN payment p ON p.id_quote = q.id_quote
            GROUP BY c.id, c.name
            ORDER BY c.name ASC
            """, nativeQuery = true)
    List<CategoryRevenueProjection> findRevenueByCategory();
}
