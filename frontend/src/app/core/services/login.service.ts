import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private keycloakUrl = 'http://localhost:8080/realms/master/protocol/openid-connect/token'; // Keycloak token endpoint

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('client_id', 'test'); // Replace with your client ID
    body.set('client_secret', 'I5jTe5XuQiXaldYYu4NyZCQqMEq3le9f'); // Replace with your client secret
    body.set('grant_type', 'password');
    body.set('username', username);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<any>(this.keycloakUrl, body.toString(), { headers });
  }
}