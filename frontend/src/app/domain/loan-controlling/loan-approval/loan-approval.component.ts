import { Component, inject, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { Loan } from '../../../core/models/loan.interface';
import { LoanService } from '../../../core/services/loan.service';
import { AuthStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-loan-approval',
  imports: [ButtonModule, StepperModule],
  templateUrl: './loan-approval.component.html',
  styleUrl: './loan-approval.component.scss',
})
export class LoanApprovalComponent implements OnInit {
  @Input({ required: true }) loan!: Loan;

  private readonly loanService = inject(LoanService);
  private readonly authStore = inject(AuthStore);

  canApprove = false;

  ngOnInit(): void {
    this.loanService.getLoans().subscribe((loans) => {
      console.log(loans);
    });
  }
}
