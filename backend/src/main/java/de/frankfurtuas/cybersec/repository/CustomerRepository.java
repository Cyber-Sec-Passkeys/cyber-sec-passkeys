package de.frankfurtuas.cybersec.repository;

import de.frankfurtuas.cybersec.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}