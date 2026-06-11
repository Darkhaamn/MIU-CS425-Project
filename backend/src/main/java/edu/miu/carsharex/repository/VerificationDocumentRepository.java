package edu.miu.carsharex.repository;

import edu.miu.carsharex.model.VerificationDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VerificationDocumentRepository extends JpaRepository<VerificationDocument, Long> {
    List<VerificationDocument> findByVerification_VerificationId(Long verificationId);
}
