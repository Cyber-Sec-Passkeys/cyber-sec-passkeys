import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KeycloakService } from './core/services/keycloak.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule], // Add RouterModule if needed
})
export class AppComponent implements OnInit {
  private refreshInterval: any;

  constructor(private keycloakService: KeycloakService) {}

  ngOnInit(): void {
    this.keycloakService.initKeycloak().then((authenticated) => {
      if (authenticated) {
        console.log('User is authenticated');
        this.refreshTokenPeriodically(); // Start refreshing the token periodically
      } else {
        console.log('User is not authenticated');
      }
    });
  }

  refreshTokenPeriodically(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval); // Clear any existing intervals
    }

    this.refreshInterval = setInterval(async () => {
      try {
        const response = await this.keycloakService.refreshToken(); // Use async/await here
        if (response && response.access_token) {
          this.keycloakService.saveToken(response.access_token); // Save the new access token
          console.log('Token refreshed successfully');
        }
      } catch (error) {
        console.error('Error refreshing token', error);
      }
    }, 10 * 60 * 1000);
  }
}