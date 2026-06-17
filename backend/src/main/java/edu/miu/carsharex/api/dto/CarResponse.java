package edu.miu.carsharex.api.dto;

public record CarResponse(
        Long carId,
        String brand,
        String model,
        double pricePerDay,
        boolean availabilityStatus,
        String carType,
        Long supplierId,
        String supplierName,
        String imageUrl
) {}
