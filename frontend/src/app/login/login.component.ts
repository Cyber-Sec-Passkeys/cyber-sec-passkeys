/*import { Component } from '@angular/core';
import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  constructor(private loginService: LoginService) { }

  onSubmit(event: Event) {
    event.preventDefault(); // Prevent form submission
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    
    this.loginService.login(username, password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        alert('Login successful');
        // Redirect or handle post-login behavior
      },
      error: (err) => {
        console.error('Login failed', err);
        alert('Login failed');
      }
    });
  }

  loginWithPasskey() {
    this.loginService.loginWithPasskey();
  }


}*/


import { Component } from '@angular/core';
import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  message = '';

  constructor(private loginService: LoginService) {
    this.checkForAuthorizationCode();
  }

  loginWithPasskey(): void {
    this.loginService.loginWithPasskey();
  }

  private checkForAuthorizationCode(): void {
    // Parse the URL for the "code" parameter
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Exchange the authorization code for a token
      this.loginService.exchangeCodeForToken(code).subscribe({
        next: (response) => {
          this.message = 'Login with passkey successful!';
          console.log('Token:', response.access_token);
          // Clear the code from the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        },
        error: (err) => {
          this.message = 'Login with passkey failed.';
          console.error('Error:', err);
        }
      });
    }
  }
}