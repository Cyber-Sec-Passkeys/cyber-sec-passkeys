import { inject, Injectable } from '@angular/core';
import {
  AuthConfig,
  OAuthService,
  OAuthSuccessEvent,
} from 'angular-oauth2-oidc';
import { environment } from '../../../environments/environment.development';

export const AUTH_CONFIG: AuthConfig = {
  issuer: environment.keycloak.url,
  redirectUri: environment.keycloak.redirectUrl,
  postLogoutRedirectUri: environment.keycloak.postLogoutRedirectUri,
  useSilentRefresh: true,
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  timeoutFactor: 0.8,
  clientId: environment.keycloak.clientId,
  scope: 'openid profile email',
  responseType: 'code',
  disableAtHashCheck: true,
  showDebugInformation: environment.keycloak.showDebugInformation,
};

export const VALID_ROLES: string[] = [
  'customer',
  'finance-staff',
  'loan-approver',
  'load-processor',
];

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

  public hasValidRole(): boolean {
    const roles =
      this.oAuthService.getIdentityClaims()['realm_access']['roles'];
    return VALID_ROLES.some((role) => roles.includes(role));
  }

  public getAccessToken(): string {
    return this.oAuthService.getAccessToken();
  }

  public setupAutomaticRefresh(): void {
    this.oAuthService.setupAutomaticSilentRefresh();
  }

  public stopAutomaticRefresh(): void {
    this.oAuthService.stopAutomaticRefresh();
  }
}
