package de.frankfurtuas.cybersec.repository;

import de.frankfurtuas.cybersec.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Loan entities.
 * <p>
 * This interface extends JpaRepository to provide CRUD operations and database access for Loan.
 */
@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {}
