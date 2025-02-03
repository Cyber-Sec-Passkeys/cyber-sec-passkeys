import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { StepperModule } from 'primeng/stepper';
import { Customer } from '../../../core/models/customer.interface';
import { Loan } from '../../../core/models/loan.interface';
import { LoanService } from '../../../core/services/loan.service';
import { AuthStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-loan-approval',
  imports: [ButtonModule, StepperModule, ProgressSpinnerModule],
  templateUrl: './loan-approval.component.html',
  styleUrl: './loan-approval.component.scss',
})
export class LoanApprovalComponent implements OnInit {
  private readonly loanService = inject(LoanService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  selectedLoan: Loan | undefined;
  customer: Customer | undefined;
  canApprove: boolean = false;

  ngOnInit() {
    if (this.loanService.selectedLoan === undefined) {
      this.router.navigate(['/loans']);
    } else {
      this.selectedLoan = this.loanService.selectedLoan!;
      this.customer = this.selectedLoan.customer;
      this.canApprove =
        this.authStore.isLoanApprover() &&
        this.selectedLoan.status === 'IN_APPROVAL' &&
        this.selectedLoan.approver === this.authStore.username();
    }
  }

  approveLoan() {
    this.loanService.approveLoan(this.selectedLoan!.id).subscribe((loan) => {
      this.router.navigate(['/loans']);
    });
  }
}
