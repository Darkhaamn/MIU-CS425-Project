package edu.miu.carsharex.service;

import edu.miu.carsharex.model.Admin;
import edu.miu.carsharex.repository.AdminRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public List<Admin> findAll() {
        return adminRepository.findAll();
    }

    public Optional<Admin> findById(Long id) {
        return adminRepository.findById(id);
    }

    public Admin save(Admin admin) {
        return adminRepository.save(admin);
    }

    public void deleteById(Long id) {
        adminRepository.deleteById(id);
    }

    public Optional<Admin> login(String email, String password) {
        return adminRepository.findByEmail(email)
                .filter(a -> a.getPassword() != null && a.getPassword().equals(password));
    }
}
