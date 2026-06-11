package edu.miu.carsharex.repository;

import edu.miu.carsharex.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByCustomer_UserId(Long customerId);
}
