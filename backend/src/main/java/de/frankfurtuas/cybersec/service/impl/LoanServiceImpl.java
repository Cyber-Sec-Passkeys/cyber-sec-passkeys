package de.frankfurtuas.cybersec.service.impl;

import de.frankfurtuas.cybersec.model.Customer;
import de.frankfurtuas.cybersec.model.Loan;
import de.frankfurtuas.cybersec.repository.CustomerRepository;
import de.frankfurtuas.cybersec.repository.LoanRepository;
import de.frankfurtuas.cybersec.service.LoanService;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

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
  public LoanServiceImpl(LoanRepository loanRepository, CustomerRepository customerRepository) {
    this.loanRepository = loanRepository;
  }

  @Override
  public Loan applyForLoan(Loan loan) {
    loan.setStatus("PENDING");
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
  public Loan claimApproval(Long id) {
    Loan loan = getLoanById(id);
    if (!"PENDING".equals(loan.getStatus())) {
      throw new IllegalStateException("Loan must be in 'PENDING' status to claim for approval.");
    }
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String approver = auth.getName();
    loan.setApprover(approver);
    loan.setStatus("IN_APPROVAL");
    return loanRepository.save(loan);
  }

  @Override
  public Loan claimProcessing(Long id) {
    Loan loan = getLoanById(id);
    if (!"APPROVED".equals(loan.getStatus())) {
      throw new IllegalStateException("Loan must be in 'APPROVED' status to claim for processing.");
    }
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String processor = auth.getName();
    loan.setProcessor(processor);
    loan.setStatus("IN_PROCESSING");
    return loanRepository.save(loan);
  }

  @Override
  public Loan approveLoan(Long id) {
    Loan loan = getLoanById(id);
    if (!"IN_APPROVAL".equals(loan.getStatus())) {
      throw new IllegalStateException("Loan must be in 'IN_APPROVAL' status to approve.");
    }
    loan.setStatus("APPROVED");
    return loanRepository.save(loan);
  }

  @Override
  public Loan processLoan(Long id) {
    Loan loan = getLoanById(id);
    if (!"IN_PROCESSING".equals(loan.getStatus())) {
      throw new IllegalStateException("Loan must be in 'IN_PROCESSING' status to process.");
    }
    loan.setStatus("PROCESSED");
    return loanRepository.save(loan);
  }
}
