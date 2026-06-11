package edu.miu.carsharex.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * VerificationDocument entity – uploaded documents used during verification.
 */
@Entity
@Table(name = "verification_documents")
@Getter
@Setter
@NoArgsConstructor
public class VerificationDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long documentId;

    private String documentType;

    private String documentURL;

    private LocalDate uploadDate = LocalDate.now();

    private LocalDate expiryDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verification_id")
    private Verification verification;
}
