package edu.miu.carsharex.api;

import edu.miu.carsharex.api.dto.*;
import edu.miu.carsharex.api.mapper.DtoMapper;
import edu.miu.carsharex.config.SessionConstants;
import edu.miu.carsharex.model.Customer;
import edu.miu.carsharex.service.BookingService;
import edu.miu.carsharex.service.CustomerService;
import edu.miu.carsharex.service.ReviewService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
public class CustomerApiController {

    private final CustomerService customerService;
    private final BookingService bookingService;
    private final ReviewService reviewService;
    private final DtoMapper mapper;

    public CustomerApiController(CustomerService customerService,
                                 BookingService bookingService,
                                 ReviewService reviewService,
                                 DtoMapper mapper) {
        this.customerService = customerService;
        this.bookingService = bookingService;
        this.reviewService = reviewService;
        this.mapper = mapper;
    }

    @GetMapping("/profile")
    @Transactional(readOnly = true)
    public CustomerResponse profile(HttpSession session) {
        Long customerId = requireCustomer(session);
        return mapper.toCustomerResponse(customerService.findById(customerId).orElseThrow());
    }

    @PutMapping("/profile")
    public CustomerResponse updateProfile(@Valid @RequestBody UpdateProfileRequest request,
                                          HttpSession session) {
        Long customerId = requireCustomer(session);
        Customer updates = new Customer();
        updates.setFullName(request.fullName());
        updates.setPhoneNumber(request.phoneNumber());
        updates.setAddress(request.address());
        updates.setPassword(request.password());
        Customer updated = customerService.updateProfile(customerId, updates);
        return mapper.toCustomerResponse(updated);
    }

    @GetMapping("/bookings")
    @Transactional(readOnly = true)
    public List<BookingResponse> bookings(HttpSession session) {
        Long customerId = requireCustomer(session);
        return mapper.toBookingResponses(bookingService.findByCustomer(customerId));
    }

    @PostMapping("/bookings")
    @Transactional
    public BookingResponse createBooking(@Valid @RequestBody CreateBookingRequest request,
                                         HttpSession session) {
        Long customerId = requireCustomer(session);
        String paymentMethod = request.paymentMethod() != null ? request.paymentMethod() : "CREDIT_CARD";
        var booking = bookingService.createBooking(
                customerId, request.carIds(), request.pickupDate(), request.returnDate(), paymentMethod
        );
        return mapper.toBookingResponse(booking);
    }

    @PostMapping("/bookings/{id}/cancel")
    @Transactional
    public BookingResponse cancelBooking(@PathVariable Long id, HttpSession session) {
        requireCustomer(session);
        return mapper.toBookingResponse(bookingService.cancelBooking(id));
    }

    @PostMapping("/reviews")
    @Transactional
    public ReviewResponse addReview(@Valid @RequestBody CreateReviewRequest request,
                                    HttpSession session) {
        Long customerId = requireCustomer(session);
        var review = reviewService.addReview(customerId, request.carId(), request.rating(), request.comment());
        return mapper.toReviewResponse(review);
    }

    @GetMapping("/dashboard")
    @Transactional(readOnly = true)
    public ResponseEntity<CustomerDashboardResponse> dashboard(HttpSession session) {
        Long customerId = requireCustomer(session);
        Customer customer = customerService.findById(customerId).orElseThrow();
        var bookings = mapper.toBookingResponses(bookingService.findByCustomer(customerId));
        return ResponseEntity.ok(new CustomerDashboardResponse(
                mapper.toCustomerResponse(customer),
                bookings.stream().limit(5).toList()
        ));
    }

    private Long requireCustomer(HttpSession session) {
        Long customerId = (Long) session.getAttribute(SessionConstants.CUSTOMER_ID);
        if (customerId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Customer login required");
        }
        return customerId;
    }

    public record CustomerDashboardResponse(CustomerResponse customer, List<BookingResponse> recentBookings) {}
}
