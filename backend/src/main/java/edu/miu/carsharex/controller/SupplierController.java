package edu.miu.carsharex.controller;

import edu.miu.carsharex.config.SessionConstants;
import edu.miu.carsharex.model.Car;
import edu.miu.carsharex.model.Supplier;
import edu.miu.carsharex.service.BookingService;
import edu.miu.carsharex.service.CarService;
import edu.miu.carsharex.service.ReportService;
import edu.miu.carsharex.service.SupplierService;
import edu.miu.carsharex.service.VerificationService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.ArrayList;
import java.util.List;

/**
 * SupplierControllers – car fleet management, rental orders, and availability.
 */
@Controller
@RequestMapping("/supplier")
public class SupplierController {

    private final SupplierService supplierService;
    private final CarService carService;
    private final BookingService bookingService;
    private final ReportService reportService;
    private final VerificationService verificationService;

    public SupplierController(SupplierService supplierService,
                              CarService carService,
                              BookingService bookingService,
                              ReportService reportService,
                              VerificationService verificationService) {
        this.supplierService = supplierService;
        this.carService = carService;
        this.bookingService = bookingService;
        this.reportService = reportService;
        this.verificationService = verificationService;
    }

    @GetMapping("/register")
    public String registerForm(Model model) {
        model.addAttribute("supplier", new Supplier());
        return "supplier/register";
    }

    @PostMapping("/register")
    public String register(@Valid @ModelAttribute Supplier supplier,
                           BindingResult result,
                           RedirectAttributes redirect) {
        if (result.hasErrors()) {
            return "supplier/register";
        }
        try {
            supplierService.register(supplier);
            redirect.addFlashAttribute("message", "Registration successful. Please log in.");
            return "redirect:/supplier/login";
        } catch (IllegalArgumentException e) {
            result.rejectValue("email", "error.email", e.getMessage());
            return "supplier/register";
        }
    }

    @GetMapping("/login")
    public String loginForm() {
        return "supplier/login";
    }

    @PostMapping("/login")
    public String login(@RequestParam String email,
                        @RequestParam String password,
                        HttpSession session,
                        RedirectAttributes redirect) {
        return supplierService.login(email, password)
                .map(s -> {
                    session.setAttribute(SessionConstants.SUPPLIER_ID, s.getSupplierId());
                    return "redirect:/supplier/dashboard";
                })
                .orElseGet(() -> {
                    redirect.addFlashAttribute("error", "Invalid email or password");
                    return "redirect:/supplier/login";
                });
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.removeAttribute(SessionConstants.SUPPLIER_ID);
        return "redirect:/";
    }

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        Long supplierId = requireSupplier(session);
        if (supplierId == null) {
            return "redirect:/supplier/login";
        }
        Supplier supplier = supplierService.findById(supplierId).orElseThrow();
        model.addAttribute("supplier", supplier);
        model.addAttribute("cars", carService.findBySupplier(supplierId));
        return "supplier/dashboard";
    }

    @GetMapping("/cars")
    public String listCars(HttpSession session, Model model) {
        Long supplierId = requireSupplier(session);
        if (supplierId == null) {
            return "redirect:/supplier/login";
        }
        model.addAttribute("cars", carService.findBySupplier(supplierId));
        return "supplier/cars";
    }

    @GetMapping("/cars/new")
    public String newCarForm(Model model) {
        model.addAttribute("car", new Car());
        return "supplier/car-form";
    }

    @PostMapping("/cars")
    public String addCar(@Valid @ModelAttribute Car car,
                         BindingResult result,
                         HttpSession session,
                         RedirectAttributes redirect) {
        Long supplierId = requireSupplier(session);
        if (supplierId == null) {
            return "redirect:/supplier/login";
        }
        if (result.hasErrors()) {
            return "supplier/car-form";
        }
        try {
            carService.save(car, supplierId);
        } catch (IllegalStateException | IllegalArgumentException e) {
            redirect.addFlashAttribute("error", e.getMessage());
            return "supplier/car-form";
        }
        redirect.addFlashAttribute("message", "Car added successfully");
        return "redirect:/supplier/cars";
    }

    @GetMapping("/cars/{id}/edit")
    public String editCarForm(@PathVariable Long id, Model model) {
        model.addAttribute("car", carService.findById(id).orElseThrow());
        return "supplier/car-form";
    }

    @PostMapping("/cars/{id}")
    public String updateCar(@PathVariable Long id,
                            @ModelAttribute Car car,
                            RedirectAttributes redirect) {
        carService.update(id, car);
        redirect.addFlashAttribute("message", "Car updated");
        return "redirect:/supplier/cars";
    }

    @PostMapping("/cars/{id}/delete")
    public String deleteCar(@PathVariable Long id, RedirectAttributes redirect) {
        carService.deleteById(id);
        redirect.addFlashAttribute("message", "Car removed");
        return "redirect:/supplier/cars";
    }

    @PostMapping("/cars/{id}/availability")
    public String toggleAvailability(@PathVariable Long id,
                                     @RequestParam boolean available,
                                     RedirectAttributes redirect) {
        carService.updateAvailability(id, available);
        redirect.addFlashAttribute("message", "Availability updated");
        return "redirect:/supplier/cars";
    }

    @GetMapping("/orders")
    public String rentalOrders(HttpSession session, Model model) {
        Long supplierId = requireSupplier(session);
        if (supplierId == null) {
            return "redirect:/supplier/login";
        }
        List<edu.miu.carsharex.model.Booking> orders = new ArrayList<>();
        for (Car car : carService.findBySupplier(supplierId)) {
            orders.addAll(bookingService.findByCar(car.getCarId()));
        }
        model.addAttribute("orders", orders);
        return "supplier/orders";
    }

    @GetMapping("/reports")
    public String reports(HttpSession session, Model model) {
        Long supplierId = requireSupplier(session);
        if (supplierId == null) {
            return "redirect:/supplier/login";
        }
        model.addAttribute("reports", reportService.findBySupplier(supplierId));
        return "supplier/reports";
    }

    @PostMapping("/reports/generate")
    public String generateReport(HttpSession session, RedirectAttributes redirect) {
        Long supplierId = requireSupplier(session);
        if (supplierId == null) {
            return "redirect:/supplier/login";
        }
        reportService.generateSummary(supplierId);
        redirect.addFlashAttribute("message", "Report generated");
        return "redirect:/supplier/reports";
    }

    @GetMapping("/verification")
    public String verification(HttpSession session, Model model) {
        Long supplierId = requireSupplier(session);
        if (supplierId == null) {
            return "redirect:/supplier/login";
        }
        verificationService.findBySupplier(supplierId).ifPresent(v -> {
            model.addAttribute("verification", v);
            model.addAttribute("documents", verificationService.findDocuments(v.getVerificationId()));
        });
        return "supplier/verification";
    }

    private Long requireSupplier(HttpSession session) {
        return (Long) session.getAttribute(SessionConstants.SUPPLIER_ID);
    }
}
