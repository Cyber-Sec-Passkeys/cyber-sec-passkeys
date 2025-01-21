import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloakInstance: Keycloak.KeycloakInstance;
  private tokenKey =
    'eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJkN2I4ZjM3OS03MzE4LTRmMTYtYTQ5Ni1hYzZlZWJmZWRjNzMifQ.eyJleHAiOjAsImlhdCI6MTczNzQ4MTgxNiwianRpIjoiOTJlOTA3YzQtZmZhYS00MzM1LWJjMGQtYzcyM2I3MGI1MDVlIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9tYXN0ZXIiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvcmVhbG1zL21hc3RlciIsInR5cCI6IlJlZ2lzdHJhdGlvbkFjY2Vzc1Rva2VuIiwicmVnaXN0cmF0aW9uX2F1dGgiOiJhdXRoZW50aWNhdGVkIn0.2S00jqeiBhIBAJdvzhg-lpHtCjN1w4Vcf0mY7qbsc_u2WW4XLmQB-bHC1dHRZfmhnJCQursbpS_TUwrpZapu6w';
  private clientId = 'test';
  private tokenUrl =
    'http://localhost:8080/realms/master/protocol/openid-connect/token';
  private refreshTokenKey = 'refresh_token';

  constructor() {
    this.keycloakInstance = new Keycloak({
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId,
    });
  }

  async initKeycloak(): Promise<boolean> {
    try {
      const authenticated = await this.keycloakInstance.init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
        redirectUri: window.location.origin,
      });

      if (authenticated) {
        // Save token after successful authentication
        this.saveToken(this.keycloakInstance.token ?? '');
      }

      return authenticated;
    } catch (error) {
      console.error('Keycloak initialization failed', error);
      return false;
    }
  }

  async register(): Promise<boolean> {
    try {
      // Redirect to Keycloak registration page
      await this.keycloakInstance.register();
      return true;
    } catch (error) {
      console.error('Registration failed', error);
      return false;
    }
  }

  async login(): Promise<boolean> {
    try {
      // Redirect to Keycloak login page
      await this.keycloakInstance.login();
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      // Call Keycloak's logout function and remove the token
      await this.keycloakInstance.logout();
      this.removeToken();
      this.removeRefreshToken();
    } catch (error) {
      console.error('Logout failed', error);
    }
  }

  async refreshToken(): Promise<any> {
    const params = new URLSearchParams();
    params.set('grant_type', 'client_credentials');
    params.set('client_id', this.clientId);

    try {
      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error refreshing token', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey); // Retrieve access token from localStorage
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey); // Retrieve refresh token from localStorage
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token); // Save access token to localStorage
  }

  saveRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token); // Save refresh token to localStorage
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey); // Remove access token on logout
  }

  removeRefreshToken(): void {
    localStorage.removeItem(this.refreshTokenKey); // Remove refresh token on logout
  }
}