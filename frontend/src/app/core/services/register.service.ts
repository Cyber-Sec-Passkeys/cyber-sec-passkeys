// registration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private keycloakUrl = 'http://localhost:8080'; // Your Keycloak URL

  constructor(private http: HttpClient) {}

  // Fetch the access token using client credentials
  private getAccessToken(): Observable<any> {
    const body = new URLSearchParams();
    body.set('client_id', 'test'); // Admin client ID
    body.set('client_secret', 'I5jTe5XuQiXaldYYu4NyZCQqMEq3le9f'); // Client secret if needed
    body.set('grant_type', 'client_credentials');

    return this.http.post<any>(`${this.keycloakUrl}/realms/master/protocol/openid-connect/token`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }

  // Create a user in Keycloak using the access token
  createUser(username: string, password: string, token: string): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    const userPayload = {
      username: username,
      enabled: true,
      credentials: [{ type: 'password', value: password }],
      firstName: 'First',
      lastName: 'Last'
    };

    return this.http.post<any>(`${this.keycloakUrl}/admin/realms/master/users`, userPayload, { headers });
  }

  // Register the user
  registerUser(username: string, password: string): Observable<any> {
    return this.getAccessToken().pipe(
      switchMap(tokenResponse => {
        return this.createUser(username, password, tokenResponse.access_token);
      })
    );
  }
}
