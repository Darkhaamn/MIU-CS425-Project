package edu.miu.carsharex.api.dto;

import java.time.LocalDate;
import java.util.List;

public record VerificationResponse(
        Long verificationId,
        String verificationType,
        String verificationStatus,
        LocalDate verifiedAt,
        String faceRecognitionResult,
        String supplierName,
        List<VerificationDocumentResponse> documents
) {}
