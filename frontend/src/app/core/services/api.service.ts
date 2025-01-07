import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakService } from './keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private keycloakService: KeycloakService) {}

  // Function to get protected data from the backend
  getProtectedData(): Observable<any> {
    const token = this.keycloakService.getToken();  // Retrieve the token from KeycloakService

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      // Replace with your actual API URL
      return this.http.get('http://localhost:8080/protected-resource', { headers });
    } else {
      throw new Error('No token found');
    }
  }
}
