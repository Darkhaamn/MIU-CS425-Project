package edu.miu.carsharex.service;

import edu.miu.carsharex.model.Supplier;
import edu.miu.carsharex.model.Verification;
import edu.miu.carsharex.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public List<Supplier> findAll() {
        return supplierRepository.findAll();
    }

    public Optional<Supplier> findById(Long id) {
        return supplierRepository.findById(id);
    }

    public Supplier save(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public void deleteById(Long id) {
        supplierRepository.deleteById(id);
    }

    public Optional<Supplier> login(String email, String password) {
        return supplierRepository.findByEmail(email)
                .filter(s -> s.getPassword() != null && s.getPassword().equals(password));
    }

    public Supplier register(Supplier supplier) {
        if (supplier.getEmail() != null && supplierRepository.findByEmail(supplier.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
        Supplier saved = supplierRepository.save(supplier);
        // Create linked verification record per class diagram (1:1)
        Verification verification = new Verification();
        verification.setVerificationType("SUPPLIER_IDENTITY");
        verification.setSupplier(saved);
        saved.setVerification(verification);
        return supplierRepository.save(saved);
    }
}
