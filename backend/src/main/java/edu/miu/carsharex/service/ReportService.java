package edu.miu.carsharex.service;

import edu.miu.carsharex.model.Booking;
import edu.miu.carsharex.model.Report;
import edu.miu.carsharex.model.Supplier;
import edu.miu.carsharex.repository.BookingRepository;
import edu.miu.carsharex.repository.ReportRepository;
import edu.miu.carsharex.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReportService {

    private final ReportRepository reportRepository;
    private final SupplierRepository supplierRepository;
    private final BookingRepository bookingRepository;

    public ReportService(ReportRepository reportRepository,
                         SupplierRepository supplierRepository,
                         BookingRepository bookingRepository) {
        this.reportRepository = reportRepository;
        this.supplierRepository = supplierRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<Report> findAll() {
        return reportRepository.findAll();
    }

    public Optional<Report> findById(Long id) {
        return reportRepository.findById(id);
    }

    public List<Report> findBySupplier(Long supplierId) {
        return reportRepository.findBySupplier_SupplierId(supplierId);
    }

    /** Generates a summary report for a supplier based on their car bookings. */
    public Report generateSummary(Long supplierId) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found"));

        double revenue = 0;
        int bookingCount = 0;

        for (var car : supplier.getCars()) {
            List<Booking> bookings = bookingRepository.findByCars_CarId(car.getCarId());
            for (Booking booking : bookings) {
                if ("CONFIRMED".equals(booking.getBookingStatus())) {
                    revenue += booking.getTotalPrice();
                    bookingCount++;
                }
            }
        }

        Report report = new Report();
        report.setSupplier(supplier);
        report.setReportType("SUMMARY");
        report.setGeneratedDate(LocalDate.now());
        report.setTotalRevenue(revenue);
        report.setTotalBookings(bookingCount);
        return reportRepository.save(report);
    }

    public Report save(Report report) {
        return reportRepository.save(report);
    }

    public void deleteById(Long id) {
        reportRepository.deleteById(id);
    }
}
