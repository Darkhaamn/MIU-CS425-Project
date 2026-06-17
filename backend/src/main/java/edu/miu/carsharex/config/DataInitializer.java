package edu.miu.carsharex.config;

import edu.miu.carsharex.model.*;
import edu.miu.carsharex.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.time.LocalDate;
import java.util.List;

/**
 * Seeds dummy demo data on first startup when the database is empty.
 */
@Configuration
public class DataInitializer {

    @Bean
    @Order(1)
    CommandLineRunner seedData(
            AdminRepository adminRepository,
            CustomerRepository customerRepository,
            SupplierRepository supplierRepository,
            CarRepository carRepository,
            BookingRepository bookingRepository,
            PaymentRepository paymentRepository,
            ReviewRepository reviewRepository,
            VerificationRepository verificationRepository,
            VerificationDocumentRepository documentRepository,
            ReportRepository reportRepository) {

        return args -> {
            if (adminRepository.findByEmail("admin@carsharex.com").isEmpty()) {
                Admin admin = new Admin();
                admin.setFullName("System Admin");
                admin.setEmail("admin@carsharex.com");
                admin.setPassword("admin123");
                admin.setRole("ADMIN");
                adminRepository.save(admin);
            }

            if (customerRepository.count() > 0) {
                return;
            }

            System.out.println("[DataInitializer] Seeding dummy data...");

            Customer john = new Customer();
            john.setFullName("John Doe");
            john.setEmail("john@example.com");
            john.setPhoneNumber("555-0101");
            john.setPassword("pass123");
            john.setAddress("123 Main St, Chicago");
            john = customerRepository.save(john);

            Customer jane = new Customer();
            jane.setFullName("Jane Smith");
            jane.setEmail("jane@example.com");
            jane.setPhoneNumber("555-0102");
            jane.setPassword("pass123");
            jane.setAddress("456 Oak Ave, Boston");
            jane = customerRepository.save(jane);

            Supplier cityCars = new Supplier();
            cityCars.setCompanyName("City Car Rentals");
            cityCars.setSupplierType("Company");
            cityCars.setEmail("citycars@example.com");
            cityCars.setPassword("pass123");
            cityCars.setRating(4.5);
            cityCars.setVerificationStatus("APPROVED");
            cityCars = supplierRepository.save(cityCars);

            Verification v1 = new Verification();
            v1.setVerificationType("SUPPLIER_IDENTITY");
            v1.setVerificationStatus("APPROVED");
            v1.setVerifiedAt(LocalDate.now().minusDays(30));
            v1.setFaceRecognitionResult("MATCH");
            v1.setSupplier(cityCars);
            cityCars.setVerification(v1);
            v1 = verificationRepository.save(v1);

            VerificationDocument doc1 = new VerificationDocument();
            doc1.setDocumentType("BUSINESS_LICENSE");
            doc1.setDocumentURL("https://example.com/docs/license1.pdf");
            doc1.setUploadDate(LocalDate.now().minusDays(30));
            doc1.setExpiryDate(LocalDate.now().plusYears(1));
            doc1.setVerification(v1);
            documentRepository.save(doc1);

            Supplier premium = new Supplier();
            premium.setCompanyName("Premium Auto Share");
            premium.setSupplierType("Individual");
            premium.setEmail("premium@example.com");
            premium.setPassword("pass123");
            premium.setRating(4.8);
            premium.setVerificationStatus("PENDING");
            premium = supplierRepository.save(premium);

            Verification v2 = new Verification();
            v2.setVerificationType("SUPPLIER_IDENTITY");
            v2.setVerificationStatus("PENDING");
            v2.setSupplier(premium);
            premium.setVerification(v2);
            verificationRepository.save(v2);

            Car camry = new Car();
            camry.setBrand("Toyota");
            camry.setModel("Camry");
            camry.setCarType("Sedan");
            camry.setPricePerDay(45.00);
            camry.setAvailabilityStatus(true);
            camry.setImageUrl("https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80");
            camry.setSupplier(cityCars);
            camry = carRepository.save(camry);

            Car crv = new Car();
            crv.setBrand("Honda");
            crv.setModel("CR-V");
            crv.setCarType("SUV");
            crv.setPricePerDay(65.00);
            crv.setAvailabilityStatus(true);
            crv.setImageUrl("https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop&q=80");
            crv.setSupplier(cityCars);
            crv = carRepository.save(crv);

            Car tesla = new Car();
            tesla.setBrand("Tesla");
            tesla.setModel("Model 3");
            tesla.setCarType("Electric");
            tesla.setPricePerDay(85.00);
            tesla.setAvailabilityStatus(false);
            tesla.setImageUrl("https://images.unsplash.com/photo-1593941707882-a5bba14938ca?w=800&auto=format&fit=crop&q=80");
            tesla.setSupplier(premium);
            tesla = carRepository.save(tesla);

            Car bmw = new Car();
            bmw.setBrand("BMW");
            bmw.setModel("X5");
            bmw.setCarType("SUV");
            bmw.setPricePerDay(95.00);
            bmw.setAvailabilityStatus(true);
            bmw.setImageUrl("https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=80");
            bmw.setSupplier(premium);
            bmw = carRepository.save(bmw);

            Booking booking = new Booking();
            booking.setCustomer(john);
            booking.setCars(List.of(tesla));
            booking.setPickupDate(LocalDate.now().plusDays(2));
            booking.setReturnDate(LocalDate.now().plusDays(5));
            booking.setTotalPrice(255.00);
            booking.setBookingStatus("CONFIRMED");
            booking = bookingRepository.save(booking);

            Payment payment = new Payment();
            payment.setAmount(255.00);
            payment.setPaymentMethod("CREDIT_CARD");
            payment.setPaymentStatus("COMPLETED");
            payment.setTransactionId("TXN-DEMO001");
            payment.setBooking(booking);
            payment.setCustomer(john);
            booking.setPayment(payment);
            paymentRepository.save(payment);

            Review review1 = new Review();
            review1.setCustomer(jane);
            review1.setCar(camry);
            review1.setRating(5);
            review1.setComment("Great car, smooth ride!");
            review1.setReviewDate(LocalDate.now().minusDays(5));
            reviewRepository.save(review1);

            Review review2 = new Review();
            review2.setCustomer(john);
            review2.setCar(crv);
            review2.setRating(4);
            review2.setComment("Spacious and comfortable.");
            review2.setReviewDate(LocalDate.now().minusDays(2));
            reviewRepository.save(review2);

            Report report = new Report();
            report.setSupplier(cityCars);
            report.setReportType("SUMMARY");
            report.setGeneratedDate(LocalDate.now());
            report.setTotalRevenue(255.00);
            report.setTotalBookings(1);
            reportRepository.save(report);

            System.out.println("[DataInitializer] Dummy data seeded successfully.");
        };
    }
}
