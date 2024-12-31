package de.frankfurtuas.cybersec.repository;

import de.frankfurtuas.cybersec.entities.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanRepository extends JpaRepository<Loan, Long> {
}