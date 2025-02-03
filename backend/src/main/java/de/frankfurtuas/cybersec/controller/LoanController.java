package de.frankfurtuas.cybersec.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.frankfurtuas.cybersec.model.Loan;
import de.frankfurtuas.cybersec.service.LoanService;

/**
 * REST Controller for managing loans.
 * <p>
 * This controller handles HTTP requests.
 */
@CrossOrigin("*")
@RestController
@RequestMapping("/loans")
public class LoanController {

  private final LoanService loanService;

  /**
   * Constructor for LoanController.
   *
   * @param loanService LoanService
   */
  public LoanController(LoanService loanService) {
    this.loanService = loanService;
  }

  /**
   * Retrieves a list of all loans.
   *
   * @return A list of Loan objects. @PreAuthorize Ensures only users with the 'finance-staff' role
   *     can access this endpoint.
   */
  @GetMapping
  @PreAuthorize("hasRole('finance-staff')")
  public List<Loan> getAllLoans() {
    return loanService.getAllLoans();
  }

  /**
   * Allows a customer to apply for a new loan.
   *
   * @param loan The loan details provided by the customer.
   * @return The created Loan object. @PreAuthorize Ensures only users with the 'customer' role can
   *     access this endpoint.
   */
  @PostMapping
  @PreAuthorize("hasRole('customer')")
  public Loan applyForLoan(@RequestBody Loan loan) {
    return loanService.applyForLoan(loan);
  }

  /**
   * Retrieves a specific loan by its ID.
   *
   * @param id The unique identifier of the loan.
   * @return The Loan object with the given ID. @PreAuthorize Ensures only users with the
   *     'finance-staff' role can access this endpoint.
   */
  @GetMapping("/{id}")
  @PreAuthorize("hasRole('finance-staff')")
  public Loan getLoanById(@PathVariable Long id) {
    return loanService.getLoanById(id);
  }

  /**
   * Claims the approval process for the loan with the given ID.
   *
   * @param id The unique identifier of the loan to approve.
   * @return The updated Loan object with an 'Approved' status. @PreAuthorize Ensures only users
   *     with the 'loan-approver' role can access this endpoint.
   */
  @PutMapping("/{id}/claim-approval")
  @PreAuthorize("hasRole('loan-approver')")
  public Loan claimApproval(@PathVariable Long id) {
    return loanService.claimApproval(id);
  }

  /**
   * Claims the processing of the loan with the given ID.
   * 
   * @param id The unique identifier of the loan to process.
   * @return The updated Loan object with a 'Processed' status. @PreAuthorize Ensures only users
   *    with the 'loan-processor' role can access this endpoint.
   */
  @PutMapping("/{id}/claim-processing")
  @PreAuthorize("hasRole('loan-processor')")
  public Loan claimProcessing(@PathVariable Long id) {
    return loanService.claimProcessing(id);
  }

  /**
   * Approves a loan with the given ID.
   *
   * @param id The unique identifier of the loan to approve.
   * @return The updated Loan object with an 'Approved' status. @PreAuthorize Ensures only users
   *     with the 'loan-approver' role can access this endpoint.
   */
  @PutMapping("/{id}/approve")
  @PreAuthorize("hasRole('loan-approver')")
  public Loan approveLoan(@PathVariable Long id) {
    return loanService.approveLoan(id);
  }

  /**
   * Processes a loan with the given ID for disbursement.
   *
   * @param id The unique identifier of the loan to process.
   * @return The updated Loan object with a 'Processed' status. @PreAuthorize Ensures only users
   *     with the 'loan-processor' role can access this endpoint.
   */
  @PutMapping("/{id}/process")
  @PreAuthorize("hasRole('loan-processor')")
  public Loan processLoan(@PathVariable Long id) {
    return loanService.processLoan(id);
  }
}
