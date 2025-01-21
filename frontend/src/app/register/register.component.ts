import { Component } from '@angular/core';
import { RegistrationService } from '../core/services/register.service'; // Import the service

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(private registrationService: RegistrationService) {}

  // Handle form submission and register the user
  onSubmit(event: Event) {
    event.preventDefault();
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    this.registrationService.redirectToKeycloakRegistration(username);

    /*const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Register the user by calling the service
    this.registrationService.registerUser(username,email, password).subscribe(
      (      response) => {
        console.log('User registered successfully:', response);
        alert('Registration successful!');
      },
      (      error) => {
        console.error('Error during registration:', error);
        alert('Registration failed. Please try again.');
      }
    ); */
  } 

  registerWithPasskey() {
    //this.registrationService.registerWithPasskey();
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    this.registrationService.redirectToKeycloakRegistration(username);
  }
}