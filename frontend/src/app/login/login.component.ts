import { Component } from '@angular/core';
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
}