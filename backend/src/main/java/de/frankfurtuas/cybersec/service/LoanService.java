package de.frankfurtuas.cybersec.service;

import de.frankfurtuas.cybersec.model.Loan;

import java.util.List;

/** Service interface for managing loans. */
public interface LoanService {

  /**
   * Submits a new loan application.
   *
   * @param loan The loan details provided by the customer.
   * @return The saved Loan object with a unique identifier and initial status.
   */
  Loan applyForLoan(Loan loan);

  /**
   * Retrieves a list of all loans in the system.
   *
   * @return A list of all Loan objects.
   */
  List<Loan> getAllLoans();

  /**
   * Retrieves the details of a specific loan by its unique identifier.
   *
   * @param id The unique identifier of the loan.
   * @return The Loan object corresponding to the given ID.
   */
  Loan getLoanById(Long id);

  /**
   * Claims a loan application for review.
   *
   * @param id The unique identifier of the loan to claim.
   * @return The updated Loan object with a claimed status.
   */
  Loan claimApproval(Long id);

  /**
   * Claims a loan application for processing.
   *
   * @param id The unique identifier of the loan to claim.
   * @return The updated Loan object with a claimed status.
   */
   Loan claimProcessing(Long id);

  /**
   * Approves a loan application based on its ID.
   *
   * @param id The unique identifier of the loan to approve.
   * @return The updated Loan object with an approved status.
   */
  Loan approveLoan(Long id);

  /**
   * Processes a loan for disbursement after approval.
   *
   * @param id The unique identifier of the loan to process.
   * @return The updated Loan object reflecting its processed status.
   */
  Loan processLoan(Long id);
}
