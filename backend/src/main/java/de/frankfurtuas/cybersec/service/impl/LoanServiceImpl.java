package de.frankfurtuas.cybersec.service.impl;

import de.frankfurtuas.cybersec.model.Loan;
import de.frankfurtuas.cybersec.repository.LoanRepository;
import de.frankfurtuas.cybersec.service.LoanService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of the LoanService interface.
 * <p>
 * This class provides the business logic for loan-related operations, such as applying for
 * loans, retrieving loans, approving loans, and processing them.
 */
@Service
@Transactional
public class LoanServiceImpl implements LoanService {

  private final LoanRepository loanRepository;

  /**
   * Constructor for LoanServiceImpl.
   *
   * @param loanRepository LoanRepository
   */
  public LoanServiceImpl(LoanRepository loanRepository) {
    this.loanRepository = loanRepository;
  }

  @Override
  public Loan applyForLoan(Loan loan) {
    loan.setStatus("Pending");
    return loanRepository.save(loan);
  }

  @Override
  public List<Loan> getAllLoans() {
    return loanRepository.findAll();
  }

  @Override
  public Loan getLoanById(Long id) {
    return loanRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("Loan not found with ID: " + id));
  }

  @Override
  public Loan approveLoan(Long id) {
    Loan loan = getLoanById(id);
    if (!"Pending".equals(loan.getStatus())) {
      throw new IllegalStateException("Loan must be in 'Pending' status to approve.");
    }
    loan.setStatus("Approved");
    return loanRepository.save(loan);
  }

  @Override
  public Loan processLoan(Long id) {
    Loan loan = getLoanById(id);
    if (!"Approved".equals(loan.getStatus())) {
      throw new IllegalStateException("Loan must be in 'Approved' status to process.");
    }
    loan.setStatus("Processed");
    return loanRepository.save(loan);
  }
}
