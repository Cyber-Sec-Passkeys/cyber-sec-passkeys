package de.frankfurtuas.cybersec.service;

import de.frankfurtuas.cybersec.entities.Loan;
import de.frankfurtuas.cybersec.repository.LoanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;

    public LoanServiceImpl(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    @Override
    public Loan applyForLoan(Loan loan) {
        loan.setStatus("Pending"); // Initial status
        return loanRepository.save(loan);
    }

    @Override
    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    @Override
    public Loan getLoanById(Long id) {
        return loanRepository.findById(id)
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