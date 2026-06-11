package edu.miu.carsharex.repository;

import edu.miu.carsharex.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findBySupplier_SupplierId(Long supplierId);
}
