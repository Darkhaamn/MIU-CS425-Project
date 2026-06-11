package edu.miu.carsharex.controller;

import edu.miu.carsharex.config.SessionConstants;
import edu.miu.carsharex.model.Admin;
import edu.miu.carsharex.service.AdminService;
import edu.miu.carsharex.service.BookingService;
import edu.miu.carsharex.service.CustomerService;
import edu.miu.carsharex.service.PaymentService;
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

/**
 * AdminControllers – manage customers, suppliers, verifications, payments, and reports.
 */
@Controller
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;
    private final CustomerService customerService;
    private final SupplierService supplierService;
    private final BookingService bookingService;
    private final PaymentService paymentService;
    private final ReportService reportService;
    private final VerificationService verificationService;

    public AdminController(AdminService adminService,
                           CustomerService customerService,
                           SupplierService supplierService,
                           BookingService bookingService,
                           PaymentService paymentService,
                           ReportService reportService,
                           VerificationService verificationService) {
        this.adminService = adminService;
        this.customerService = customerService;
        this.supplierService = supplierService;
        this.bookingService = bookingService;
        this.paymentService = paymentService;
        this.reportService = reportService;
        this.verificationService = verificationService;
    }

    @GetMapping("/login")
    public String loginForm() {
        return "admin/login";
    }

    @PostMapping("/login")
    public String login(@RequestParam String email,
                        @RequestParam String password,
                        HttpSession session,
                        RedirectAttributes redirect) {
        return adminService.login(email, password)
                .map(a -> {
                    session.setAttribute(SessionConstants.ADMIN_ID, a.getAdminId());
                    return "redirect:/admin/dashboard";
                })
                .orElseGet(() -> {
                    redirect.addFlashAttribute("error", "Invalid credentials");
                    return "redirect:/admin/login";
                });
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.removeAttribute(SessionConstants.ADMIN_ID);
        return "redirect:/";
    }

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        if (!isLoggedIn(session)) {
            return "redirect:/admin/login";
        }
        model.addAttribute("customerCount", customerService.findAll().size());
        model.addAttribute("supplierCount", supplierService.findAll().size());
        model.addAttribute("bookingCount", bookingService.findAll().size());
        model.addAttribute("paymentCount", paymentService.findAll().size());
        return "admin/dashboard";
    }

    // --- Customer management ---
    @GetMapping("/customers")
    public String customers(HttpSession session, Model model) {
        if (!isLoggedIn(session)) return "redirect:/admin/login";
        model.addAttribute("customers", customerService.findAll());
        return "admin/customers";
    }

    @GetMapping("/customers/new")
    public String newCustomerForm(Model model) {
        model.addAttribute("customer", new edu.miu.carsharex.model.Customer());
        return "admin/customer-form";
    }

    @PostMapping("/customers")
    public String createCustomer(@Valid @ModelAttribute edu.miu.carsharex.model.Customer customer,
                                 BindingResult result) {
        if (result.hasErrors()) return "admin/customer-form";
        customerService.save(customer);
        return "redirect:/admin/customers";
    }

    @GetMapping("/customers/{id}/edit")
    public String editCustomerForm(@PathVariable Long id, Model model) {
        model.addAttribute("customer", customerService.findById(id).orElseThrow());
        return "admin/customer-form";
    }

    @PostMapping("/customers/{id}")
    public String updateCustomer(@PathVariable Long id,
                                 @ModelAttribute edu.miu.carsharex.model.Customer customer) {
        customer.setUserId(id);
        customerService.save(customer);
        return "redirect:/admin/customers";
    }

    @PostMapping("/customers/{id}/delete")
    public String deleteCustomer(@PathVariable Long id) {
        customerService.deleteById(id);
        return "redirect:/admin/customers";
    }

    // --- Supplier management ---
    @GetMapping("/suppliers")
    public String suppliers(HttpSession session, Model model) {
        if (!isLoggedIn(session)) return "redirect:/admin/login";
        model.addAttribute("suppliers", supplierService.findAll());
        return "admin/suppliers";
    }

    @PostMapping("/suppliers/{id}/delete")
    public String deleteSupplier(@PathVariable Long id) {
        supplierService.deleteById(id);
        return "redirect:/admin/suppliers";
    }

    // --- Verifications ---
    @GetMapping("/verifications")
    public String verifications(HttpSession session, Model model) {
        if (!isLoggedIn(session)) return "redirect:/admin/login";
        model.addAttribute("verifications", verificationService.findAll());
        return "admin/verifications";
    }

    @PostMapping("/verifications/{id}/approve")
    public String approveVerification(@PathVariable Long id, RedirectAttributes redirect) {
        verificationService.approveVerification(id);
        redirect.addFlashAttribute("message", "Verification approved");
        return "redirect:/admin/verifications";
    }

    // --- Payments ---
    @GetMapping("/payments")
    public String payments(HttpSession session, Model model) {
        if (!isLoggedIn(session)) return "redirect:/admin/login";
        model.addAttribute("payments", paymentService.findAll());
        return "admin/payments";
    }

    // --- Reports ---
    @GetMapping("/reports")
    public String reports(HttpSession session, Model model) {
        if (!isLoggedIn(session)) return "redirect:/admin/login";
        model.addAttribute("reports", reportService.findAll());
        return "admin/reports";
    }

    // --- Admin CRUD ---
    @GetMapping("/admins")
    public String admins(HttpSession session, Model model) {
        if (!isLoggedIn(session)) return "redirect:/admin/login";
        model.addAttribute("admins", adminService.findAll());
        return "admin/admins";
    }

    @GetMapping("/admins/new")
    public String newAdminForm(Model model) {
        model.addAttribute("admin", new Admin());
        return "admin/admin-form";
    }

    @PostMapping("/admins")
    public String createAdmin(@Valid @ModelAttribute Admin admin, BindingResult result) {
        if (result.hasErrors()) return "admin/admin-form";
        adminService.save(admin);
        return "redirect:/admin/admins";
    }

    @PostMapping("/admins/{id}/delete")
    public String deleteAdmin(@PathVariable Long id) {
        adminService.deleteById(id);
        return "redirect:/admin/admins";
    }

    private boolean isLoggedIn(HttpSession session) {
        return session.getAttribute(SessionConstants.ADMIN_ID) != null;
    }
}
