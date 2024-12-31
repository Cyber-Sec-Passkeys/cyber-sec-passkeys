package de.frankfurtuas.cybersec.controller;

import de.frankfurtuas.cybersec.entities.Loan;
import de.frankfurtuas.cybersec.service.LoanService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/loans")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping
    @PreAuthorize("hasRole('finance-staff')")
    public List<Loan> getAllLoans() {
        return loanService.getAllLoans();
    }

    @PostMapping
    @PreAuthorize("hasRole('customer')")
    public Loan applyForLoan(@RequestBody Loan loan) {
        return loanService.applyForLoan(loan);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('finance-staff')")
    public Loan getLoanById(@PathVariable Long id) {
        return loanService.getLoanById(id);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('loan-approver')")
    public Loan approveLoan(@PathVariable Long id) {
        return loanService.approveLoan(id);
    }

    @PutMapping("/{id}/process")
    @PreAuthorize("hasRole('loan-processor')")
    public Loan processLoan(@PathVariable Long id) {
        return loanService.processLoan(id);
    }
}