package edu.miu.carsharex.console;

import edu.miu.carsharex.model.Booking;
import edu.miu.carsharex.model.Car;
import edu.miu.carsharex.model.Customer;
import edu.miu.carsharex.service.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDate;
import java.util.List;
import java.util.Scanner;

/**
 * Interactive console menu for testing services without the web UI.
 * Runs in a background thread so the web server keeps running.
 * Disable with: app.console.enabled=false
 */
@Component
@Order(2)
public class ConsoleMenu implements CommandLineRunner {

    private final CustomerService customerService;
    private final SupplierService supplierService;
    private final CarService carService;
    private final BookingService bookingService;
    private final PaymentService paymentService;
    private final ReviewService reviewService;
    private final AdminService adminService;
    private final VerificationService verificationService;
    private final ReportService reportService;
    private final TransactionTemplate transactionTemplate;

    @Value("${app.console.enabled:true}")
    private boolean enabled;

    public ConsoleMenu(CustomerService customerService,
                       SupplierService supplierService,
                       CarService carService,
                       BookingService bookingService,
                       PaymentService paymentService,
                       ReviewService reviewService,
                       AdminService adminService,
                       VerificationService verificationService,
                       ReportService reportService,
                       PlatformTransactionManager transactionManager) {
        this.customerService = customerService;
        this.supplierService = supplierService;
        this.carService = carService;
        this.bookingService = bookingService;
        this.paymentService = paymentService;
        this.reviewService = reviewService;
        this.adminService = adminService;
        this.verificationService = verificationService;
        this.reportService = reportService;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
    }

    @Override
    public void run(String... args) {
        if (!enabled) {
            return;
        }
        Thread menuThread = new Thread(this::startMenu, "console-menu");
        menuThread.setDaemon(true);
        menuThread.start();
    }

    private void startMenu() {
        Scanner scanner = new Scanner(System.in);
        printWelcome();

        boolean running = true;
        while (running) {
            printMenu();
            System.out.print("Choose an option: ");
            String choice = scanner.nextLine().trim();

            try {
                Boolean keepRunning = transactionTemplate.execute(status ->
                        handleChoice(choice, scanner));
                running = keepRunning != null && keepRunning;
            } catch (Exception e) {
                System.out.println("Error: " + e.getMessage());
            }
            System.out.println();
        }
        scanner.close();
    }

    private void printWelcome() {
        System.out.println();
        System.out.println("========================================");
        System.out.println("   CarShareX Console Test Menu");
        System.out.println("   Web UI: http://localhost:8080");
        System.out.println("========================================");
        System.out.println();
    }

    private void printMenu() {
        System.out.println("--- Main Menu ---");
        System.out.println(" 1. List all customers");
        System.out.println(" 2. List all suppliers");
        System.out.println(" 3. List available cars");
        System.out.println(" 4. Search cars by keyword");
        System.out.println(" 5. List all bookings");
        System.out.println(" 6. Create a test booking");
        System.out.println(" 7. Cancel a booking");
        System.out.println(" 8. List all payments");
        System.out.println(" 9. List all reviews");
        System.out.println("10. List all admins");
        System.out.println("11. List verifications");
        System.out.println("12. Approve a verification");
        System.out.println("13. List reports");
        System.out.println("14. Generate supplier report");
        System.out.println("15. Show demo login credentials");
        System.out.println(" 0. Exit console menu (app keeps running)");
    }

    private boolean handleChoice(String choice, Scanner scanner) {
        switch (choice) {
            case "1" -> listCustomers();
            case "2" -> listSuppliers();
            case "3" -> listAvailableCars();
            case "4" -> searchCars(scanner);
            case "5" -> listBookings();
            case "6" -> createBooking(scanner);
            case "7" -> cancelBooking(scanner);
            case "8" -> listPayments();
            case "9" -> listReviews();
            case "10" -> listAdmins();
            case "11" -> listVerifications();
            case "12" -> approveVerification(scanner);
            case "13" -> listReports();
            case "14" -> generateReport(scanner);
            case "15" -> showCredentials();
            case "0" -> {
                System.out.println("Console menu closed. Web app still running at http://localhost:8080");
                return false;
            }
            default -> System.out.println("Invalid option. Please try again.");
        }
        return true;
    }

    private void listCustomers() {
        System.out.println("\n--- Customers ---");
        customerService.findAll().forEach(c ->
                System.out.printf("  [%d] %s | %s | %s%n",
                        c.getUserId(), c.getFullName(), c.getEmail(), c.getPhoneNumber()));
    }

    private void listSuppliers() {
        System.out.println("\n--- Suppliers ---");
        supplierService.findAll().forEach(s ->
                System.out.printf("  [%d] %s | %s | Verification: %s | Rating: %.1f%n",
                        s.getSupplierId(), s.getCompanyName(), s.getEmail(),
                        s.getVerificationStatus(), s.getRating()));
    }

    private void listAvailableCars() {
        System.out.println("\n--- Available Cars ---");
        carService.findAvailable().forEach(c ->
                System.out.printf("  [%d] %s %s | %s | $%.2f/day | Supplier: %s%n",
                        c.getCarId(), c.getBrand(), c.getModel(), c.getCarType(),
                        c.getPricePerDay(),
                        c.getSupplier() != null ? c.getSupplier().getCompanyName() : "N/A"));
    }

    private void searchCars(Scanner scanner) {
        System.out.print("Enter keyword (brand/model): ");
        String keyword = scanner.nextLine().trim();
        System.out.println("\n--- Search Results ---");
        carService.search(keyword, null).forEach(c ->
                System.out.printf("  [%d] %s %s | $%.2f/day | Available: %s%n",
                        c.getCarId(), c.getBrand(), c.getModel(),
                        c.getPricePerDay(), c.isAvailabilityStatus()));
    }

    private void listBookings() {
        System.out.println("\n--- Bookings ---");
        bookingService.findAll().forEach(b -> {
            String cars = b.getCars().stream()
                    .map(c -> c.getBrand() + " " + c.getModel())
                    .reduce((a, c) -> a + ", " + c).orElse("None");
            System.out.printf("  [%d] Customer: %s | Cars: %s | %s → %s | $%.2f | %s%n",
                    b.getBookingId(),
                    b.getCustomer() != null ? b.getCustomer().getFullName() : "N/A",
                    cars, b.getPickupDate(), b.getReturnDate(),
                    b.getTotalPrice(), b.getBookingStatus());
        });
    }

    private void createBooking(Scanner scanner) {
        listCustomers();
        System.out.print("Customer ID: ");
        Long customerId = Long.parseLong(scanner.nextLine().trim());

        listAvailableCars();
        System.out.print("Car ID: ");
        Long carId = Long.parseLong(scanner.nextLine().trim());

        System.out.print("Pickup date (YYYY-MM-DD): ");
        LocalDate pickup = LocalDate.parse(scanner.nextLine().trim());
        System.out.print("Return date (YYYY-MM-DD): ");
        LocalDate returnDate = LocalDate.parse(scanner.nextLine().trim());

        Booking booking = bookingService.createBooking(
                customerId, List.of(carId), pickup, returnDate, "CREDIT_CARD");
        System.out.printf("Booking created! ID: %d | Total: $%.2f | Status: %s%n",
                booking.getBookingId(), booking.getTotalPrice(), booking.getBookingStatus());
    }

    private void cancelBooking(Scanner scanner) {
        listBookings();
        System.out.print("Booking ID to cancel: ");
        Long bookingId = Long.parseLong(scanner.nextLine().trim());
        Booking cancelled = bookingService.cancelBooking(bookingId);
        System.out.println("Booking " + cancelled.getBookingId() + " cancelled.");
    }

    private void listPayments() {
        System.out.println("\n--- Payments ---");
        paymentService.findAll().forEach(p ->
                System.out.printf("  [%d] $%.2f | %s | %s | Txn: %s%n",
                        p.getPaymentId(), p.getAmount(), p.getPaymentMethod(),
                        p.getPaymentStatus(), p.getTransactionId()));
    }

    private void listReviews() {
        System.out.println("\n--- Reviews ---");
        reviewService.findAll().forEach(r ->
                System.out.printf("  [%d] %d/5 | %s | Car: %s %s | By: %s%n",
                        r.getReviewId(), r.getRating(), r.getComment(),
                        r.getCar().getBrand(), r.getCar().getModel(),
                        r.getCustomer().getFullName()));
    }

    private void listAdmins() {
        System.out.println("\n--- Admins ---");
        adminService.findAll().forEach(a ->
                System.out.printf("  [%d] %s | %s | Role: %s%n",
                        a.getAdminId(), a.getFullName(), a.getEmail(), a.getRole()));
    }

    private void listVerifications() {
        System.out.println("\n--- Verifications ---");
        verificationService.findAll().forEach(v ->
                System.out.printf("  [%d] Supplier: %s | Type: %s | Status: %s%n",
                        v.getVerificationId(),
                        v.getSupplier() != null ? v.getSupplier().getCompanyName() : "N/A",
                        v.getVerificationType(), v.getVerificationStatus()));
    }

    private void approveVerification(Scanner scanner) {
        listVerifications();
        System.out.print("Verification ID to approve: ");
        Long id = Long.parseLong(scanner.nextLine().trim());
        verificationService.approveVerification(id);
        System.out.println("Verification " + id + " approved.");
    }

    private void listReports() {
        System.out.println("\n--- Reports ---");
        reportService.findAll().forEach(r ->
                System.out.printf("  [%d] Supplier: %s | %s | Revenue: $%.2f | Bookings: %d%n",
                        r.getReportId(),
                        r.getSupplier() != null ? r.getSupplier().getCompanyName() : "N/A",
                        r.getReportType(), r.getTotalRevenue(), r.getTotalBookings()));
    }

    private void generateReport(Scanner scanner) {
        listSuppliers();
        System.out.print("Supplier ID: ");
        Long supplierId = Long.parseLong(scanner.nextLine().trim());
        var report = reportService.generateSummary(supplierId);
        System.out.printf("Report generated! ID: %d | Revenue: $%.2f | Bookings: %d%n",
                report.getReportId(), report.getTotalRevenue(), report.getTotalBookings());
    }

    private void showCredentials() {
        System.out.println("\n--- Demo Login Credentials ---");
        System.out.println("Admin:    admin@carsharex.com / admin123");
        System.out.println("Customer: john@example.com / pass123");
        System.out.println("Customer: jane@example.com / pass123");
        System.out.println("Supplier: citycars@example.com / pass123");
        System.out.println("Supplier: premium@example.com / pass123");
        System.out.println("\nWeb URLs:");
        System.out.println("  Home:     http://localhost:8080");
        System.out.println("  Customer: http://localhost:8080/customer/login");
        System.out.println("  Supplier: http://localhost:8080/supplier/login");
        System.out.println("  Admin:    http://localhost:8080/admin/login");
    }
}
