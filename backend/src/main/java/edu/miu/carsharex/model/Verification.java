package edu.miu.carsharex.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Verification entity – identity or supplier verification process.
 * One supplier has exactly one verification record.
 */
@Entity
@Table(name = "verifications")
@Getter
@Setter
@NoArgsConstructor
public class Verification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long verificationId;

    private String verificationType;

    private String verificationStatus = "PENDING";

    private LocalDate verifiedAt;

    private String faceRecognitionResult;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @OneToMany(mappedBy = "verification", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VerificationDocument> documents = new ArrayList<>();
}
