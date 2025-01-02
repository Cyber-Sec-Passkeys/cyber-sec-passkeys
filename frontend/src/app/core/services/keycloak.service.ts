import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloak: Keycloak.KeycloakInstance;

  constructor() {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8080',
      realm: 'master',
      clientId: 'admin-cli',
    });
  }

  init(): Promise<boolean> {
    return this.keycloak.init({ onLoad: 'login-required' });
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout();
  }

  async getToken(): Promise<string> {
    return this.keycloak.token as string;
  }

  async isAuthenticated(): Promise<boolean> {
    return this.keycloak.authenticated as boolean;
  }
}
