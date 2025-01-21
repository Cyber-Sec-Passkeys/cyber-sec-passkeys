import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    body.set('client_secret', '3RUae0cDBMkq4YRHkE5RZs2sLTbo4JtB'); // Replace with your client secret
    body.set('grant_type', 'client_credentials');

    return this.http.post<any>(`${this.keycloakUrl}/realms/master/protocol/openid-connect/token`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }

  // Create a user in Keycloak using the access token
  private createUser(username: string, email: string, password: string, token: string): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    const userPayload = {
      username: username,
      email: email,
      enabled: true,
      credentials: [{ type: 'password', value: password }],
      firstName: 'First',
      lastName: 'Last'
    };

    return this.http.post<any>(`${this.keycloakUrl}/admin/realms/master/users`, userPayload, { headers });
  }

  // Register the user
  registerUser(username: string, email: string, password: string): Observable<any> {
    return this.getAccessToken().pipe(
      switchMap(tokenResponse => {
        return this.createUser(username, email, password, tokenResponse.access_token);
      })
    );
  }

  // Redirect to Keycloak registration flow for WebAuthn
  redirectToKeycloakRegistration(username: string): void {
    const keycloakAuthUrl = `${this.keycloakUrl}/realms/master/login-actions/registration`;
    const params = new URLSearchParams();

    params.set('client_id', 'test'); // Replace with your client ID
    params.set('redirect_uri', 'http://localhost:4200'); // Ensure this matches your Keycloak client's settings
    params.set('response_type', 'code'); // Authorization Code flow
    params.set('scope', 'openid'); // OpenID scope
    params.set('kc_action', 'register'); // Trigger registration flow
    params.set('login_hint', username); // Pre-fill the username

    // Redirect to Keycloak registration page
    window.location.href = `${keycloakAuthUrl}?${params.toString()}`;
  }
}
