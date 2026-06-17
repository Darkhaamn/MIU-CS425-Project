package edu.miu.carsharex.service;

import edu.miu.carsharex.model.Booking;
import edu.miu.carsharex.model.Car;
import edu.miu.carsharex.model.Customer;
import edu.miu.carsharex.model.Payment;
import edu.miu.carsharex.repository.BookingRepository;
import edu.miu.carsharex.repository.CarRepository;
import edu.miu.carsharex.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final CarRepository carRepository;
    private final VerificationService verificationService;
    private final PaymentService paymentService;

    public BookingService(BookingRepository bookingRepository,
                          CustomerRepository customerRepository,
                          CarRepository carRepository,
                          VerificationService verificationService,
                          PaymentService paymentService) {
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.carRepository = carRepository;
        this.verificationService = verificationService;
        this.paymentService = paymentService;
    }

    public List<Booking> findAll() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> findById(Long id) {
        return bookingRepository.findById(id);
    }

    public List<Booking> findByCustomer(Long customerId) {
        return bookingRepository.findByCustomer_UserId(customerId);
    }

    public List<Booking> findByCar(Long carId) {
        return bookingRepository.findByCars_CarId(carId);
    }

    /**
     * Creates a booking: verifies customer, calculates price, processes payment, marks car unavailable.
     */
    public Booking createBooking(Long customerId, List<Long> carIds,
                                 LocalDate pickupDate, LocalDate returnDate,
                                 String paymentMethod) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        // Include: Verify Customer (use case diagram)
        if (!verificationService.verifyCustomer(customer)) {
            throw new IllegalStateException("Customer identity verification failed");
        }

        LocalDate today = LocalDate.now();
        if (pickupDate.isBefore(today)) {
            throw new IllegalArgumentException("Pickup date cannot be in the past");
        }
        if (returnDate.isBefore(pickupDate) || returnDate.isEqual(pickupDate)) {
            throw new IllegalArgumentException("Return date must be after pickup date");
        }

        List<Car> cars = new ArrayList<>();
        double totalPrice = 0;
        long days = java.time.temporal.ChronoUnit.DAYS.between(pickupDate, returnDate);

        for (Long carId : carIds) {
            Car car = carRepository.findById(carId)
                    .orElseThrow(() -> new IllegalArgumentException("Car not found: " + carId));
            if (!car.isAvailabilityStatus()) {
                throw new IllegalStateException("Car is not available: " + car.getBrand() + " " + car.getModel());
            }
            cars.add(car);
            totalPrice += car.calculatePrice(days);
        }

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setCars(cars);
        booking.setPickupDate(pickupDate);
        booking.setReturnDate(returnDate);
        booking.setTotalPrice(totalPrice);
        booking.setBookingStatus("CONFIRMED");

        Booking saved = bookingRepository.save(booking);

        // Include: Make Payment (use case diagram)
        Payment payment = paymentService.processPayment(saved, customer, paymentMethod);
        saved.setPayment(payment);

        for (Car car : cars) {
            car.markUnavailable();
            carRepository.save(car);
        }

        return bookingRepository.save(saved);
    }

    public Booking cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        booking.setBookingStatus("CANCELLED");
        if (booking.getPayment() != null) {
            paymentService.refundPayment(booking.getPayment().getPaymentId());
        }
        for (Car car : booking.getCars()) {
            car.updateAvailability(true);
            carRepository.save(car);
        }
        return bookingRepository.save(booking);
    }

    public Booking updateBooking(Long bookingId, LocalDate pickupDate, LocalDate returnDate) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        booking.setPickupDate(pickupDate);
        booking.setReturnDate(returnDate);
        long days = booking.calculateDuration();
        double total = booking.getCars().stream().mapToDouble(c -> c.calculatePrice(days)).sum();
        booking.setTotalPrice(total);
        return bookingRepository.save(booking);
    }

    public void deleteById(Long id) {
        bookingRepository.deleteById(id);
    }
}
