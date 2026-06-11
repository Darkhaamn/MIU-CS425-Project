package edu.miu.carsharex.api.dto;

import java.time.LocalDate;
import java.util.List;

public record BookingResponse(
        Long bookingId,
        LocalDate pickupDate,
        LocalDate returnDate,
        double totalPrice,
        String bookingStatus,
        Long customerId,
        String customerName,
        List<CarSummary> cars,
        PaymentSummary payment
) {
    public record CarSummary(Long carId, String brand, String model) {}
    public record PaymentSummary(Long paymentId, double amount, String paymentMethod, String paymentStatus) {}
}
