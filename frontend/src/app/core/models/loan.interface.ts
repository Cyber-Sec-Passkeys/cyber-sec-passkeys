export interface Loan {
  id?: number;
  customerId?: string;
  status: string;
  amount: number;
  interestRate: number;
  termInMonths: number;
}
