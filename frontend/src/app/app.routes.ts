import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoanApprovalComponent } from './domain/loan-controlling/loan-approval/loan-approval.component';
import { LoanDisbursementComponent } from './domain/loan-controlling/loan-disbursement/loan-disbursement.component';
import { LoansComponent } from './domain/loan-controlling/loans/loans.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '403', component: ForbiddenComponent },
  { path: 'loans', component: LoansComponent, canActivate: [authGuard] },
  {
    path: 'loan-approval',
    component: LoanApprovalComponent,
    canActivate: [authGuard],
  },
  {
    path: 'loan-disbursement',
    component: LoanDisbursementComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'login' },
];
