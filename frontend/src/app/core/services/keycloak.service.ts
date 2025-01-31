import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private readonly keycloakInstance = new Keycloak({
    url: environment.keycloak.url,
    realm: environment.keycloak.realm,
    clientId: environment.keycloak.clientId,
  });

  constructor() {
    this.keycloakInstance.init();
  }

  public register(): Promise<void> {
    return this.keycloakInstance.register();
  }
}
