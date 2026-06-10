package edu.miu.carsharex.service;

import edu.miu.carsharex.model.Car;
import edu.miu.carsharex.model.Customer;
import edu.miu.carsharex.model.Supplier;
import edu.miu.carsharex.model.Verification;
import edu.miu.carsharex.model.VerificationDocument;
import edu.miu.carsharex.repository.VerificationDocumentRepository;
import edu.miu.carsharex.repository.VerificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * VerificationService – mocks Identity Verification and Car Verification systems.
 */
@Service
@Transactional
public class VerificationService {

    private final VerificationRepository verificationRepository;
    private final VerificationDocumentRepository documentRepository;

    public VerificationService(VerificationRepository verificationRepository,
                               VerificationDocumentRepository documentRepository) {
        this.verificationRepository = verificationRepository;
        this.documentRepository = documentRepository;
    }

    public List<Verification> findAll() {
        return verificationRepository.findAll();
    }

    public Optional<Verification> findById(Long id) {
        return verificationRepository.findById(id);
    }

    public Optional<Verification> findBySupplier(Long supplierId) {
        return verificationRepository.findBySupplier_SupplierId(supplierId);
    }

    /** Mock customer identity check during booking. */
    public boolean verifyCustomer(Customer customer) {
        return customer.getEmail() != null && customer.getFullName() != null;
    }

    /** Mock car verification when supplier manages cars. */
    public boolean verifyCar(Car car) {
        return car.getBrand() != null && car.getModel() != null;
    }

    public Verification approveVerification(Long verificationId) {
        Verification verification = verificationRepository.findById(verificationId)
                .orElseThrow(() -> new IllegalArgumentException("Verification not found"));
        verification.setVerificationStatus("APPROVED");
        verification.setVerifiedAt(LocalDate.now());
        verification.setFaceRecognitionResult("MATCH");
        if (verification.getSupplier() != null) {
            verification.getSupplier().setVerificationStatus("APPROVED");
        }
        return verificationRepository.save(verification);
    }

    public VerificationDocument uploadDocument(Long verificationId, VerificationDocument document) {
        Verification verification = verificationRepository.findById(verificationId)
                .orElseThrow(() -> new IllegalArgumentException("Verification not found"));
        document.setVerification(verification);
        document.setUploadDate(LocalDate.now());
        return documentRepository.save(document);
    }

    public List<VerificationDocument> findDocuments(Long verificationId) {
        return documentRepository.findByVerification_VerificationId(verificationId);
    }

    public void deleteDocument(Long documentId) {
        documentRepository.deleteById(documentId);
    }

    public Verification save(Verification verification) {
        return verificationRepository.save(verification);
    }

    public void deleteById(Long id) {
        verificationRepository.deleteById(id);
    }
}
