package edu.miu.carsharex.controller;

import edu.miu.carsharex.config.SessionConstants;
import edu.miu.carsharex.model.Booking;
import edu.miu.carsharex.model.Customer;
import edu.miu.carsharex.service.BookingService;
import edu.miu.carsharex.service.CarService;
import edu.miu.carsharex.service.CustomerService;
import edu.miu.carsharex.service.ReviewService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.util.List;

/**
 * CustomerControllers – handles customer-facing web requests (search, book, manage bookings).
 */
@Controller
@RequestMapping("/customer")
public class CustomerController {

    private final CustomerService customerService;
    private final CarService carService;
    private final BookingService bookingService;
    private final ReviewService reviewService;

    public CustomerController(CustomerService customerService,
                              CarService carService,
                              BookingService bookingService,
                              ReviewService reviewService) {
        this.customerService = customerService;
        this.carService = carService;
        this.bookingService = bookingService;
        this.reviewService = reviewService;
    }

    @GetMapping("/register")
    public String registerForm(Model model) {
        model.addAttribute("customer", new Customer());
        return "customer/register";
    }

    @PostMapping("/register")
    public String register(@Valid @ModelAttribute Customer customer,
                           BindingResult result,
                           RedirectAttributes redirect) {
        if (result.hasErrors()) {
            return "customer/register";
        }
        try {
            customerService.register(customer);
            redirect.addFlashAttribute("message", "Registration successful. Please log in.");
            return "redirect:/customer/login";
        } catch (IllegalArgumentException e) {
            result.rejectValue("email", "error.email", e.getMessage());
            return "customer/register";
        }
    }

    @GetMapping("/login")
    public String loginForm() {
        return "customer/login";
    }

    @PostMapping("/login")
    public String login(@RequestParam String email,
                        @RequestParam String password,
                        HttpSession session,
                        RedirectAttributes redirect) {
        return customerService.login(email, password)
                .map(c -> {
                    session.setAttribute(SessionConstants.CUSTOMER_ID, c.getUserId());
                    return "redirect:/customer/dashboard";
                })
                .orElseGet(() -> {
                    redirect.addFlashAttribute("error", "Invalid email or password");
                    return "redirect:/customer/login";
                });
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.removeAttribute(SessionConstants.CUSTOMER_ID);
        return "redirect:/";
    }

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        Long customerId = (Long) session.getAttribute(SessionConstants.CUSTOMER_ID);
        if (customerId == null) {
            return "redirect:/customer/login";
        }
        Customer customer = customerService.findById(customerId).orElseThrow();
        model.addAttribute("customer", customer);
        model.addAttribute("bookings", bookingService.findByCustomer(customerId));
        return "customer/dashboard";
    }

    @GetMapping("/profile")
    public String profileForm(HttpSession session, Model model) {
        Long customerId = (Long) session.getAttribute(SessionConstants.CUSTOMER_ID);
        if (customerId == null) {
            return "redirect:/customer/login";
        }
        model.addAttribute("customer", customerService.findById(customerId).orElseThrow());
        return "customer/profile";
    }

    @PostMapping("/profile")
    public String updateProfile(@ModelAttribute Customer customer,
                                HttpSession session,
                                RedirectAttributes redirect) {
        Long customerId = (Long) session.getAttribute(SessionConstants.CUSTOMER_ID);
        if (customerId == null) {
            return "redirect:/customer/login";
        }
        customerService.updateProfile(customerId, customer);
        redirect.addFlashAttribute("message", "Profile updated");
        return "redirect:/customer/dashboard";
    }

    @GetMapping("/cars")
    public String searchCars(@RequestParam(required = false) String keyword,
                             @RequestParam(required = false) String carType,
                             Model model) {
        model.addAttribute("cars", carService.search(keyword, carType));
        model.addAttribute("keyword", keyword);
        model.addAttribute("carType", carType);
        return "customer/cars";
    }

    @GetMapping("/cars/{id}")
    public String carDetails(@PathVariable Long id, Model model) {
        model.addAttribute("car", carService.findById(id).orElseThrow());
        model.addAttribute("reviews", reviewService.findByCar(id));
        return "customer/car-details";
    }

    @GetMapping("/book/{carId}")
    public String bookForm(@PathVariable Long carId, HttpSession session, Model model) {
        Long customerId = (Long) session.getAttribute(SessionConstants.CUSTOMER_ID);
        if (customerId == null) {
            return "redirect:/customer/login";
        }
        model.addAttribute("car", carService.findById(carId).orElseThrow());
        return "customer/book";
    }

    @PostMapping("/book/{carId}")
    public String createBooking(@PathVariable Long carId,
                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate pickupDate,
                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate returnDate,
                                @RequestParam(defaultValue = "CREDIT_CARD") String paymentMethod,
                                HttpSession session,
                                RedirectAttributes redirect) {
        Long customerId = (Long) session.getAttribute(SessionConstants.CUSTOMER_ID);
        if (customerId == null) {
            return "redirect:/customer/login";
        }
        try {
            Booking booking = bookingService.createBooking(
                    customerId, List.of(carId), pickupDate, returnDate, paymentMethod);
            redirect.addFlashAttribute("message", "Booking confirmed! ID: " + booking.getBookingId());
            return "redirect:/customer/bookings";
        } catch (Exception e) {
            redirect.addFlashAttribute("error", e.getMessage());
            return "redirect:/customer/book/" + carId;
        }
    }

    @GetMapping("/bookings")
    public String myBookings(HttpSession session, Model model) {
        Long customerId = (Long) session.getAttribute(SessionConstants.CUSTOMER_ID);
        if (customerId == null) {
            return "redirect:/customer/login";
        }
        model.addAttribute("bookings", bookingService.findByCustomer(customerId));
        return "customer/bookings";
    }

    @PostMapping("/bookings/{id}/cancel")
    public String cancelBooking(@PathVariable Long id, RedirectAttributes redirect) {
        bookingService.cancelBooking(id);
        redirect.addFlashAttribute("message", "Booking cancelled");
        return "redirect:/customer/bookings";
    }

    @GetMapping("/reviews/new")
    public String reviewForm(@RequestParam Long carId, HttpSession session, Model model) {
        Long customerId = (Long) session.getAttribute(SessionConstants.CUSTOMER_ID);
        if (customerId == null) {
            return "redirect:/customer/login";
        }
        model.addAttribute("carId", carId);
        model.addAttribute("car", carService.findById(carId).orElseThrow());
        return "customer/review";
    }

    @PostMapping("/reviews")
    public String addReview(@RequestParam Long carId,
                            @RequestParam int rating,
                            @RequestParam String comment,
                            HttpSession session,
                            RedirectAttributes redirect) {
        Long customerId = (Long) session.getAttribute(SessionConstants.CUSTOMER_ID);
        if (customerId == null) {
            return "redirect:/customer/login";
        }
        reviewService.addReview(customerId, carId, rating, comment);
        redirect.addFlashAttribute("message", "Review submitted");
        return "redirect:/customer/cars/" + carId;
    }
}
