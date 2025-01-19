// registration.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { KeycloakService } from './keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private keycloakUrl = 'http://localhost:8080'; // Your Keycloak URL

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) {}

  // Fetch the access token using client credentials
  private getAccessToken(): Observable<any> {
    const body = new URLSearchParams();
    body.set('client_id', 'test'); // Admin client ID
    body.set('client_secret', 'FSlu7KLLVDB2if7ndDQPnMtnEgQx2HWe'); // Client secret if needed
    body.set('grant_type', 'client_credentials');

    return this.http.post<any>(`${this.keycloakUrl}/realms/master/protocol/openid-connect/token`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }

  // Create a user in Keycloak using the access token
  createUser(username: string, password: string, email: string, token: string): Observable<any> {
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
  registerUser(username: string,email: string, password: string): Observable<any> {
    return this.getAccessToken().pipe(
      switchMap(tokenResponse => {
        return this.createUser(username, password,email, tokenResponse.access_token);
      })
    );
  }

  registerWithPasskey(): void {
    this.keycloakService.register();

    // // Step 1: Fetch the access token
    // this.getAccessToken().subscribe({
    //   next: (tokenResponse: any) => {
    //     const token = tokenResponse.access_token;

    //     // Step 2: Create the body for the WebAuthn challenge request
    //     const body = new URLSearchParams();
    //     body.set('username', username);
    //     body.set('email', email);

    //     // Step 3: Send the WebAuthn challenge request to Keycloak
    //     this.http
    //       .post<any>(
    //         `${this.keycloakUrl}/realms/master/protocol/openid-connect/token`,
    //         body.toString(),
    //         {
    //           headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //             Authorization: `Bearer ${token}`, // Pass the access token here
    //           },
    //         }
    //       )
    //       .subscribe({
    //         next: (challengeResponse: any) => {
    //           const publicKeyCredentialCreationOptions = challengeResponse;

    //           // Step 4: Handle the WebAuthn API to create the public key credential
    //           navigator.credentials
    //             .create({ publicKey: publicKeyCredentialCreationOptions })
    //             .then((credential: any) => {
    //               // Step 5: Send the WebAuthn credential back to Keycloak for validation
    //               this.http
    //                 .post<any>(
    //                   `${this.keycloakUrl}/realms/master/protocol/openid-connect/auth/device/callback`,
    //                   credential,
    //                   {
    //                     headers: {
    //                       'Content-Type': 'application/json',
    //                       Authorization: `Bearer ${token}`, // Include the access token again for the callback
    //                     },
    //                   }
    //                 )
    //                 .subscribe({
    //                   next: () => {
    //                     console.log('Passkey registration successful');
    //                     alert('Passkey registration successful');
    //                   },
    //                   error: (err) => {
    //                     console.error('Passkey registration failed', err);
    //                     alert('Passkey registration failed');
    //                   },
    //                 });
    //             })
    //             .catch((err) => {
    //               console.error('Error with WebAuthn API', err);
    //               alert('WebAuthn error occurred');
    //             });
    //         },
    //         error: (err) => {
    //           console.error('Challenge request failed', err);
    //           alert('Failed to get WebAuthn challenge');
    //         },
    //       });
    //   },
    //   error: (err) => {
    //     console.error('Failed to fetch access token', err);
    //     alert('Failed to get access token');
    //   },
    // });
  }
}
