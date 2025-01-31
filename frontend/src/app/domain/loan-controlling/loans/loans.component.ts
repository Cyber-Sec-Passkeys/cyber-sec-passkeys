import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Loan } from '../../../core/models/loan.interface';
import { LoanService } from '../../../core/services/loan.service';
import { AuthStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-loans',
  imports: [CardModule, ButtonModule],
  templateUrl: './loans.component.html',
  styleUrl: './loans.component.scss',
})
export class LoansComponent {
  private readonly loanService = inject(LoanService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  hasApproverRole = this.authStore.rollen().includes('loan-approver');

  loans: Loan[] = [];

  ngOnInit(): void {
    this.loanService.getLoans().subscribe((loans) => {
      this.loanService.loans = loans;
      this.loans = loans;
    });
  }

  editLoan(load: Loan): void {
    this.loanService.selectedLoan = load;
    this.router.navigate(['/loan-approval']);
  }
}
