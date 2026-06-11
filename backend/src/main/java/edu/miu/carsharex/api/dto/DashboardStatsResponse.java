package edu.miu.carsharex.api.dto;

public record DashboardStatsResponse(
        int customerCount,
        int supplierCount,
        int bookingCount,
        int paymentCount
) {}
