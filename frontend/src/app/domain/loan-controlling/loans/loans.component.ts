import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { Loan } from '../../../core/models/loan.interface';
import { LoanService } from '../../../core/services/loan.service';
import { AuthStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-loans',
  imports: [CardModule, ButtonModule, ChipModule],
  templateUrl: './loans.component.html',
  styleUrl: './loans.component.scss',
})
export class LoansComponent {
  private readonly loanService = inject(LoanService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  hasApproverRole = this.authStore.isLoanApprover;
  hasProcessorRole = this.authStore.isLoanProcessor;
  username = this.authStore.username;

  loans: Loan[] = [];

  ngOnInit(): void {
    this.loanService.getLoans().subscribe((loans) => {
      this.loanService.loans = loans;
      this.loans = loans;
    });
  }

  claimApprovalTask(loan: Loan): void {
    this.loanService.claimApproval(loan.id!).subscribe((loan) => {
      this.openLoan(loan);
    });
  }

  claimProcessingTask(loan: Loan): void {
    this.loanService.claimProcessing(loan.id!).subscribe((loan) => {
      this.openLoan(loan);
    });
  }

  openLoan(loan: Loan): void {
    this.loanService.selectedLoan = loan;
    this.router.navigate(['/loan-approval']);
  }
}
