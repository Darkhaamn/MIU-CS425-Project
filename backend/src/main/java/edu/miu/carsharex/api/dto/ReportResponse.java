package edu.miu.carsharex.api.dto;

import java.time.LocalDate;

public record ReportResponse(
        Long reportId,
        String reportType,
        LocalDate generatedDate,
        double totalRevenue,
        int totalBookings,
        String supplierName
) {}
