package edu.miu.carsharex.api.dto;

public record PaymentResponse(
        Long paymentId,
        double amount,
        String paymentMethod,
        String paymentStatus,
        String transactionId,
        Long bookingId,
        String customerName
) {}
