package edu.miu.carsharex.api.mapper;

import edu.miu.carsharex.api.dto.*;
import edu.miu.carsharex.model.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DtoMapper {

    public CustomerResponse toCustomerResponse(Customer customer) {
        return new CustomerResponse(
                customer.getUserId(),
                customer.getFullName(),
                customer.getEmail(),
                customer.getPhoneNumber(),
                customer.getAddress()
        );
    }

    public SupplierResponse toSupplierResponse(Supplier supplier) {
        return new SupplierResponse(
                supplier.getSupplierId(),
                supplier.getSupplierType(),
                supplier.getCompanyName(),
                supplier.getEmail(),
                supplier.getRating(),
                supplier.getVerificationStatus(),
                supplier.isHiddenAddress()
        );
    }

    public AdminResponse toAdminResponse(Admin admin) {
        return new AdminResponse(
                admin.getAdminId(),
                admin.getFullName(),
                admin.getEmail(),
                admin.getRole()
        );
    }

    public CarResponse toCarResponse(Car car) {
        Supplier supplier = car.getSupplier();
        return new CarResponse(
                car.getCarId(),
                car.getBrand(),
                car.getModel(),
                car.getPricePerDay(),
                car.isAvailabilityStatus(),
                car.getCarType(),
                supplier != null ? supplier.getSupplierId() : null,
                supplier != null ? supplier.getCompanyName() : null,
                car.getImageUrl()
        );
    }

    public List<CarResponse> toCarResponses(List<Car> cars) {
        return cars.stream().map(this::toCarResponse).toList();
    }

    public BookingResponse toBookingResponse(Booking booking) {
        List<BookingResponse.CarSummary> cars = booking.getCars().stream()
                .map(c -> new BookingResponse.CarSummary(c.getCarId(), c.getBrand(), c.getModel()))
                .toList();

        BookingResponse.PaymentSummary payment = null;
        if (booking.getPayment() != null) {
            Payment p = booking.getPayment();
            payment = new BookingResponse.PaymentSummary(
                    p.getPaymentId(), p.getAmount(), p.getPaymentMethod(), p.getPaymentStatus()
            );
        }

        Customer customer = booking.getCustomer();
        return new BookingResponse(
                booking.getBookingId(),
                booking.getPickupDate(),
                booking.getReturnDate(),
                booking.getTotalPrice(),
                booking.getBookingStatus(),
                customer != null ? customer.getUserId() : null,
                customer != null ? customer.getFullName() : null,
                cars,
                payment
        );
    }

    public List<BookingResponse> toBookingResponses(List<Booking> bookings) {
        return bookings.stream().map(this::toBookingResponse).toList();
    }

    public ReviewResponse toReviewResponse(Review review) {
        Customer customer = review.getCustomer();
        return new ReviewResponse(
                review.getReviewId(),
                review.getRating(),
                review.getComment(),
                review.getReviewDate(),
                customer != null ? customer.getFullName() : "Anonymous"
        );
    }

    public List<ReviewResponse> toReviewResponses(List<Review> reviews) {
        return reviews.stream().map(this::toReviewResponse).toList();
    }

    public PaymentResponse toPaymentResponse(Payment payment) {
        Booking booking = payment.getBooking();
        Customer customer = payment.getCustomer();
        return new PaymentResponse(
                payment.getPaymentId(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getPaymentStatus(),
                payment.getTransactionId(),
                booking != null ? booking.getBookingId() : null,
                customer != null ? customer.getFullName() : null
        );
    }

    public List<PaymentResponse> toPaymentResponses(List<Payment> payments) {
        return payments.stream().map(this::toPaymentResponse).toList();
    }

    public VerificationDocumentResponse toDocumentResponse(VerificationDocument doc) {
        return new VerificationDocumentResponse(
                doc.getDocumentId(),
                doc.getDocumentType(),
                doc.getDocumentURL(),
                doc.getUploadDate(),
                doc.getExpiryDate()
        );
    }

    public VerificationResponse toVerificationResponse(Verification verification, List<VerificationDocument> documents) {
        Supplier supplier = verification.getSupplier();
        List<VerificationDocumentResponse> docResponses = documents.stream()
                .map(this::toDocumentResponse)
                .toList();
        return new VerificationResponse(
                verification.getVerificationId(),
                verification.getVerificationType(),
                verification.getVerificationStatus(),
                verification.getVerifiedAt(),
                verification.getFaceRecognitionResult(),
                supplier != null ? supplier.getCompanyName() : null,
                docResponses
        );
    }

    public ReportResponse toReportResponse(Report report) {
        Supplier supplier = report.getSupplier();
        return new ReportResponse(
                report.getReportId(),
                report.getReportType(),
                report.getGeneratedDate(),
                report.getTotalRevenue(),
                report.getTotalBookings(),
                supplier != null ? supplier.getCompanyName() : null
        );
    }

    public List<ReportResponse> toReportResponses(List<Report> reports) {
        return reports.stream().map(this::toReportResponse).toList();
    }
}
