package edu.miu.carsharex.api;

import edu.miu.carsharex.api.dto.*;
import edu.miu.carsharex.api.mapper.DtoMapper;
import edu.miu.carsharex.config.SessionConstants;
import edu.miu.carsharex.model.Customer;
import edu.miu.carsharex.model.Supplier;
import edu.miu.carsharex.service.AdminService;
import edu.miu.carsharex.service.CustomerService;
import edu.miu.carsharex.service.SupplierService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {

    private final CustomerService customerService;
    private final SupplierService supplierService;
    private final AdminService adminService;
    private final DtoMapper mapper;

    public AuthApiController(CustomerService customerService,
                             SupplierService supplierService,
                             AdminService adminService,
                             DtoMapper mapper) {
        this.customerService = customerService;
        this.supplierService = supplierService;
        this.adminService = adminService;
        this.mapper = mapper;
    }

    @GetMapping("/session")
    public ResponseEntity<AuthSessionResponse> session(HttpSession session) {
        Long customerId = (Long) session.getAttribute(SessionConstants.CUSTOMER_ID);
        if (customerId != null) {
            Customer customer = customerService.findById(customerId).orElseThrow();
            return ResponseEntity.ok(new AuthSessionResponse(
                    "CUSTOMER", customer.getUserId(), customer.getFullName(), customer.getEmail()
            ));
        }
        Long supplierId = (Long) session.getAttribute(SessionConstants.SUPPLIER_ID);
        if (supplierId != null) {
            Supplier supplier = supplierService.findById(supplierId).orElseThrow();
            return ResponseEntity.ok(new AuthSessionResponse(
                    "SUPPLIER", supplier.getSupplierId(), supplier.getCompanyName(), supplier.getEmail()
            ));
        }
        Long adminId = (Long) session.getAttribute(SessionConstants.ADMIN_ID);
        if (adminId != null) {
            var admin = adminService.findById(adminId).orElseThrow();
            return ResponseEntity.ok(new AuthSessionResponse(
                    "ADMIN", admin.getAdminId(), admin.getFullName(), admin.getEmail()
            ));
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/customer/register")
    public ResponseEntity<CustomerResponse> registerCustomer(@Valid @RequestBody CustomerRegisterRequest request) {
        Customer customer = new Customer();
        customer.setFullName(request.fullName());
        customer.setEmail(request.email());
        customer.setPhoneNumber(request.phoneNumber());
        customer.setPassword(request.password());
        customer.setAddress(request.address());
        Customer saved = customerService.register(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toCustomerResponse(saved));
    }

    @PostMapping("/customer/login")
    public ResponseEntity<AuthSessionResponse> loginCustomer(@Valid @RequestBody LoginRequest request,
                                                               HttpSession session) {
        return customerService.login(request.email(), request.password())
                .map(c -> {
                    clearSession(session);
                    session.setAttribute(SessionConstants.CUSTOMER_ID, c.getUserId());
                    return ResponseEntity.ok(new AuthSessionResponse(
                            "CUSTOMER", c.getUserId(), c.getFullName(), c.getEmail()
                    ));
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
    }

    @PostMapping("/supplier/register")
    public ResponseEntity<SupplierResponse> registerSupplier(@Valid @RequestBody SupplierRegisterRequest request) {
        Supplier supplier = new Supplier();
        supplier.setCompanyName(request.companyName());
        supplier.setSupplierType(request.supplierType());
        supplier.setEmail(request.email());
        supplier.setPassword(request.password());
        Supplier saved = supplierService.register(supplier);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toSupplierResponse(saved));
    }

    @PostMapping("/supplier/login")
    public ResponseEntity<AuthSessionResponse> loginSupplier(@Valid @RequestBody LoginRequest request,
                                                             HttpSession session) {
        return supplierService.login(request.email(), request.password())
                .map(s -> {
                    clearSession(session);
                    session.setAttribute(SessionConstants.SUPPLIER_ID, s.getSupplierId());
                    return ResponseEntity.ok(new AuthSessionResponse(
                            "SUPPLIER", s.getSupplierId(), s.getCompanyName(), s.getEmail()
                    ));
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AuthSessionResponse> loginAdmin(@Valid @RequestBody LoginRequest request,
                                                          HttpSession session) {
        return adminService.login(request.email(), request.password())
                .map(a -> {
                    clearSession(session);
                    session.setAttribute(SessionConstants.ADMIN_ID, a.getAdminId());
                    return ResponseEntity.ok(new AuthSessionResponse(
                            "ADMIN", a.getAdminId(), a.getFullName(), a.getEmail()
                    ));
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        clearSession(session);
        return ResponseEntity.noContent().build();
    }

    private void clearSession(HttpSession session) {
        session.removeAttribute(SessionConstants.CUSTOMER_ID);
        session.removeAttribute(SessionConstants.SUPPLIER_ID);
        session.removeAttribute(SessionConstants.ADMIN_ID);
    }
}
