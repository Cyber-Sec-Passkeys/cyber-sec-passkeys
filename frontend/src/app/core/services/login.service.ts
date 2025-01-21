import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
providedIn: 'root'
})
export class LoginService {

private keycloakUrl = 'http://localhost:8080/realms/master/protocol/openid-connect/token'; // Keycloak token endpoint
private passkeyLoginUrl = 'http://localhost:8080/realms/master/protocol/openid-connect/auth'; // Keycloak auth endpoint for passkey
constructor(private http: HttpClient) { }

login(username: string, password: string): Observable<any> {
const body = new URLSearchParams();
body.set('client_id', 'test'); // Replace with your client ID
body.set('client_secret', '3RUae0cDBMkq4YRHkE5RZs2sLTbo4JtB'); // Replace with your client secret
body.set('grant_type', 'password');
body.set('username', username);
body.set('password', password);

const headers = new HttpHeaders({
'Content-Type': 'application/x-www-form-urlencoded'
});

return this.http.post<any>(this.keycloakUrl, body.toString(), { headers });
}

/*
loginWithPasskey(): void {
  const passkeyLoginParams = new URLSearchParams();
  passkeyLoginParams.set('client_id', 'test');  // Your client ID
  passkeyLoginParams.set('redirect_uri', 'http://localhost:4200/');  // Ensure this is the same as the redirect URI in Keycloak
  passkeyLoginParams.set('response_type', 'code');  // Authorization code flow
  passkeyLoginParams.set('scope', 'openid');  // OpenID scope for authentication
  
  window.location.href = `${this.passkeyLoginUrl}?${passkeyLoginParams.toString()}`;
}*/

exchangeCodeForToken(code: string): Observable<any> {
  const body = new URLSearchParams();
  body.set('client_id', 'test');
  body.set('client_secret', '3RUae0cDBMkq4YRHkE5RZs2sLTbo4JtB');
  body.set('grant_type', 'authorization_code');
  body.set('redirect_uri', 'http://localhost:4200/'); // Ensure this matches your redirect URI
  body.set('code', code);

  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  return this.http.post<any>(this.keycloakUrl, body.toString(), { headers });
}

loginWithPasskey(): void {
  const passkeyLoginParams = new URLSearchParams();
  passkeyLoginParams.set('client_id', 'test');
  passkeyLoginParams.set('redirect_uri', 'http://localhost:4200/');
  passkeyLoginParams.set('response_type', 'code');
  passkeyLoginParams.set('scope', 'openid');

  window.location.href = `${this.passkeyLoginUrl}?${passkeyLoginParams.toString()}`;
}




}