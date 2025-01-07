import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { KeycloakService } from './core/services/keycloak.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    HttpClientModule, // Import HttpClientModule here
    {
      provide: KeycloakService,
      useFactory: (http: HttpClient) => {
        const keycloakService = new KeycloakService();
        keycloakService.initKeycloak('test', 'master', 'http://localhost:8080');
        return keycloakService;
      },
      deps: [HttpClient], // Specify that HttpClient should be injected
    },
  ],
};