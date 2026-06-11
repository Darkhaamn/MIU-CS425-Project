package edu.miu.carsharex.api;

import edu.miu.carsharex.api.dto.*;
import edu.miu.carsharex.api.mapper.DtoMapper;
import edu.miu.carsharex.config.SessionConstants;
import edu.miu.carsharex.model.Admin;
import edu.miu.carsharex.model.Customer;
import edu.miu.carsharex.service.*;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminApiController {

    private final AdminService adminService;
    private final CustomerService customerService;
    private final SupplierService supplierService;
    private final BookingService bookingService;
    private final PaymentService paymentService;
    private final ReportService reportService;
    private final VerificationService verificationService;
    private final DtoMapper mapper;

    public AdminApiController(AdminService adminService,
                              CustomerService customerService,
                              SupplierService supplierService,
                              BookingService bookingService,
                              PaymentService paymentService,
                              ReportService reportService,
                              VerificationService verificationService,
                              DtoMapper mapper) {
        this.adminService = adminService;
        this.customerService = customerService;
        this.supplierService = supplierService;
        this.bookingService = bookingService;
        this.paymentService = paymentService;
        this.reportService = reportService;
        this.verificationService = verificationService;
        this.mapper = mapper;
    }

    @GetMapping("/dashboard/stats")
    public DashboardStatsResponse stats(HttpSession session) {
        requireAdmin(session);
        return new DashboardStatsResponse(
                customerService.findAll().size(),
                supplierService.findAll().size(),
                bookingService.findAll().size(),
                paymentService.findAll().size()
        );
    }

    @GetMapping("/customers")
    public List<CustomerResponse> customers(HttpSession session) {
        requireAdmin(session);
        return customerService.findAll().stream().map(mapper::toCustomerResponse).toList();
    }

    @GetMapping("/customers/{id}")
    public CustomerResponse customer(@PathVariable Long id, HttpSession session) {
        requireAdmin(session);
        return mapper.toCustomerResponse(customerService.findById(id).orElseThrow());
    }

    @PostMapping("/customers")
    public CustomerResponse createCustomer(@Valid @RequestBody CustomerRequest request, HttpSession session) {
        requireAdmin(session);
        Customer customer = toCustomerEntity(request, null);
        return mapper.toCustomerResponse(customerService.save(customer));
    }

    @PutMapping("/customers/{id}")
    public CustomerResponse updateCustomer(@PathVariable Long id,
                                           @Valid @RequestBody CustomerRequest request,
                                           HttpSession session) {
        requireAdmin(session);
        Customer customer = toCustomerEntity(request, id);
        return mapper.toCustomerResponse(customerService.save(customer));
    }

    @DeleteMapping("/customers/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id, HttpSession session) {
        requireAdmin(session);
        customerService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/suppliers")
    public List<SupplierResponse> suppliers(HttpSession session) {
        requireAdmin(session);
        return supplierService.findAll().stream().map(mapper::toSupplierResponse).toList();
    }

    @DeleteMapping("/suppliers/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id, HttpSession session) {
        requireAdmin(session);
        supplierService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/verifications")
    @Transactional(readOnly = true)
    public List<VerificationResponse> verifications(HttpSession session) {
        requireAdmin(session);
        return verificationService.findAll().stream()
                .map(v -> mapper.toVerificationResponse(v, verificationService.findDocuments(v.getVerificationId())))
                .toList();
    }

    @PostMapping("/verifications/{id}/approve")
    @Transactional
    public VerificationResponse approveVerification(@PathVariable Long id, HttpSession session) {
        requireAdmin(session);
        var verification = verificationService.approveVerification(id);
        return mapper.toVerificationResponse(
                verification, verificationService.findDocuments(verification.getVerificationId())
        );
    }

    @GetMapping("/payments")
    @Transactional(readOnly = true)
    public List<PaymentResponse> payments(HttpSession session) {
        requireAdmin(session);
        return mapper.toPaymentResponses(paymentService.findAll());
    }

    @GetMapping("/reports")
    @Transactional(readOnly = true)
    public List<ReportResponse> reports(HttpSession session) {
        requireAdmin(session);
        return mapper.toReportResponses(reportService.findAll());
    }

    @GetMapping("/admins")
    public List<AdminResponse> admins(HttpSession session) {
        requireAdmin(session);
        return adminService.findAll().stream().map(mapper::toAdminResponse).toList();
    }

    @PostMapping("/admins")
    public AdminResponse createAdmin(@Valid @RequestBody AdminRequest request, HttpSession session) {
        requireAdmin(session);
        Admin admin = new Admin();
        admin.setFullName(request.fullName());
        admin.setEmail(request.email());
        admin.setPassword(request.password());
        admin.setRole(request.role() != null ? request.role() : "ADMIN");
        return mapper.toAdminResponse(adminService.save(admin));
    }

    @DeleteMapping("/admins/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id, HttpSession session) {
        requireAdmin(session);
        adminService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Customer toCustomerEntity(CustomerRequest request, Long id) {
        Customer customer = new Customer();
        if (id != null) {
            customer.setUserId(id);
        }
        customer.setFullName(request.fullName());
        customer.setEmail(request.email());
        customer.setPhoneNumber(request.phoneNumber());
        customer.setPassword(request.password());
        customer.setAddress(request.address());
        return customer;
    }

    private void requireAdmin(HttpSession session) {
        if (session.getAttribute(SessionConstants.ADMIN_ID) == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Admin login required");
        }
    }
}
