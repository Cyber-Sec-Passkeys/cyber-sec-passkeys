import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Loan } from '../models/loan.interface';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private readonly httpService: HttpClient = inject(HttpClient);

  private baseUrl = environment.businessServiceUrl + '/loans';

  public loans: Loan[] = [];

  public selectedLoan: Loan | undefined;

  constructor() {}

  applyForLoan(loan: Loan): Observable<Loan> {
    return this.httpService.post<Loan>(this.baseUrl, loan);
  }

  getLoans(): Observable<Loan[]> {
    return this.httpService.get<Loan[]>(this.baseUrl);
  }

  getLoanById(id: number): Observable<Loan> {
    return this.httpService.get<Loan>(`${this.baseUrl}/${id}`);
  }

  claimApproval(id: number): Observable<Loan> {
    return this.httpService.put<Loan>(
      `${this.baseUrl}/${id}/claim-approval`,
      {}
    );
  }

  claimProcessing(id: number): Observable<Loan> {
    return this.httpService.put<Loan>(
      `${this.baseUrl}/${id}/claim-processing`,
      {}
    );
  }

  approveLoan(id: number): Observable<Loan> {
    return this.httpService.put<Loan>(`${this.baseUrl}/${id}/approve`, {});
  }

  processLoan(id: number): Observable<Loan> {
    return this.httpService.put<Loan>(`${this.baseUrl}/${id}/process`, {});
  }
}
