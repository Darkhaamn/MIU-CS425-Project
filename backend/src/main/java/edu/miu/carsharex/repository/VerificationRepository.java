package edu.miu.carsharex.repository;

import edu.miu.carsharex.model.Verification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationRepository extends JpaRepository<Verification, Long> {
    Optional<Verification> findBySupplier_SupplierId(Long supplierId);
}
