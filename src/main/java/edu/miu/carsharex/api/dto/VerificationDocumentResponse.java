package edu.miu.carsharex.api.dto;

import java.time.LocalDate;

public record VerificationDocumentResponse(
        Long documentId,
        String documentType,
        String documentURL,
        LocalDate uploadDate,
        LocalDate expiryDate
) {}
