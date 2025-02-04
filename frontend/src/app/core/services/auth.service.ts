import { inject, Injectable } from '@angular/core';
import {
  AuthConfig,
  OAuthService,
  OAuthSuccessEvent,
  TokenResponse,
} from 'angular-oauth2-oidc';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { JwtAccessToken } from '../models/keycloak.model';

export const AUTH_CONFIG: AuthConfig = {
  issuer: `${environment.keycloak.url}/realms/${environment.keycloak.realm}`,
  redirectUri: environment.keycloak.redirectUrl,
  postLogoutRedirectUri: environment.keycloak.postLogoutRedirectUri,
  timeoutFactor: 0.8,
  clientId: environment.keycloak.clientId,
  scope: 'openid profile email',
  responseType: 'code',
  disableAtHashCheck: true,
  showDebugInformation: environment.keycloak.showDebugInformation,
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly oAuthService = inject(OAuthService);

  public get state(): string | undefined {
    return this.oAuthService.state;
  }

  public configure(): void {
    this.oAuthService.configure(AUTH_CONFIG);
    this.oAuthService.setStorage(localStorage);
  }

  public loadDiscoveryDocument(): Promise<OAuthSuccessEvent> {
    return this.oAuthService.loadDiscoveryDocument();
  }

  public async parseTokenFromUrl(): Promise<void> {
    await this.oAuthService.tryLogin();
  }

  public singleSignOn(): void {
    this.oAuthService.initLoginFlow(window.location.pathname);
  }

  public async login(username: string, password: string): Promise<void> {
    await this.oAuthService.fetchTokenUsingPasswordFlow(username, password);
  }

  public logout(): void {
    this.oAuthService.logOut();
  }

  public getAccessToken(): JwtAccessToken | undefined {
    const accessToken: string | null = this.oAuthService.getAccessToken();
    return accessToken ? jwtDecode(accessToken) : undefined;
  }

  public silentRefresh(): Promise<TokenResponse> {
    return this.oAuthService.refreshToken();
  }

  public setupAutomaticRefresh(): void {
    this.oAuthService.setupAutomaticSilentRefresh();
  }

  public stopAutomaticRefresh(): void {
    this.oAuthService.stopAutomaticRefresh();
  }
}
