package edu.miu.carsharex.api.dto;

public record SupplierResponse(
        Long supplierId,
        String supplierType,
        String companyName,
        String email,
        double rating,
        String verificationStatus,
        boolean hiddenAddress
) {}
