package de.frankfurtuas.cybersec.service;

import de.frankfurtuas.cybersec.entities.Loan;

import java.util.List;

public interface LoanService {

    Loan applyForLoan(Loan loan);

    List<Loan> getAllLoans();

    Loan getLoanById(Long id);

    Loan approveLoan(Long id);

    Loan processLoan(Long id);
}