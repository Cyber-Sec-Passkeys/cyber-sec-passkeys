import { Customer } from './customer.interface';

export interface Loan {
  id: number;
  customer: Customer;
  status: string;
  amount: number;
  interestRate: number;
  termInMonths: number;
  approver?: string;
  processor?: string;
}
