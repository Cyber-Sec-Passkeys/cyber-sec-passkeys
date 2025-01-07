import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloakInstance: Keycloak.KeycloakInstance;
  private tokenKey = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJJWHU4VW5kcTdlOWNUbHFzSFNqZTJLX0xyOG1LZnBQLU1sY2xEVFVucENRIn0.eyJleHAiOjE3MzYyNzMzNDAsImlhdCI6MTczNjI3MzI4MCwianRpIjoiNmViMWQ4MmQtODY1YS00ZDQzLWFiNzEtZWMwMjYzNWNjMjRkIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9tYXN0ZXIiLCJhdWQiOlsibWFzdGVyLXJlYWxtIiwiYnJva2VyIiwiYWNjb3VudCJdLCJzdWIiOiIyODZmNTQxMC0zNTVhLTQwMTUtYmIyMy04NGRiYWM1MDg3NGQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ0ZXN0IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjQyMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtbWFzdGVyIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7Im1hc3Rlci1yZWFsbSI6eyJyb2xlcyI6WyJtYW5hZ2UtZXZlbnRzIiwibWFuYWdlLXJlYWxtIiwibWFuYWdlLWlkZW50aXR5LXByb3ZpZGVycyIsImltcGVyc29uYXRpb24iLCJjcmVhdGUtY2xpZW50IiwibWFuYWdlLXVzZXJzIiwicXVlcnktcmVhbG1zIiwibWFuYWdlLWF1dGhvcml6YXRpb24iLCJxdWVyeS1jbGllbnRzIiwibWFuYWdlLWNsaWVudHMiLCJxdWVyeS1ncm91cHMiXX0sImJyb2tlciI6eyJyb2xlcyI6WyJyZWFkLXRva2VuIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50Iiwidmlldy1hcHBsaWNhdGlvbnMiLCJ2aWV3LWNvbnNlbnQiLCJ2aWV3LWdyb3VwcyIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwiZGVsZXRlLWFjY291bnQiLCJtYW5hZ2UtY29uc2VudCIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsImNsaWVudEhvc3QiOiIxNzIuMTguMC4xIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtdGVzdCIsImNsaWVudEFkZHJlc3MiOiIxNzIuMTguMC4xIiwiY2xpZW50X2lkIjoidGVzdCJ9.O8Y978dmw2qAwbJNbmjVUeRi7B23XNFLHVMO_34-Qr2W5dMF0xtNrN5xbfMliEiIbjND1MJD9D1qSe2q0LiUK0LJcZntEJhKOU2K3tVPc5M9oFKYsBU7dA1jDx9sIy8iFYfVcOHiBAxWmqIvyQNqSMyr9pEEGDylLfcXQrOIcLbsSUBdfUI-jv6QsvSpxNTut-MhaaBlnv8trM6vM7A7Ibf9Dds6KF-JCfYGm9dz-kdrEkF6kHQaFM5VWtNAEP8t60izs5o0DCQlYf74f9ZJiv4qTPK3nxvDbICmiVtxkALLxqcFhNyrlWUhr49w5dP22iZ1e5VmD1YD2l6rcDxk8A';
  private clientId = 'test'; 
  private clientSecret = 'I5jTe5XuQiXaldYYu4NyZCQqMEq3le9f'; 
  private tokenUrl = 'http://localhost:8080/realms/master/protocol/openid-connect/token'; 
  private refreshTokenKey = 'refresh_token';

  constructor() {
    this.keycloakInstance = new Keycloak({
      url: 'http://localhost:8080',
      realm: 'master',
      clientId: this.clientId,
    });
  }

  async initKeycloak(clientId: string, realm: string, url: string): Promise<boolean> {
    try {
      this.keycloakInstance = new Keycloak({
        url: url,
        realm: realm,
        clientId: clientId,
      });

      const authenticated = await this.keycloakInstance.init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
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
    params.set('client_secret', this.clientSecret);

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