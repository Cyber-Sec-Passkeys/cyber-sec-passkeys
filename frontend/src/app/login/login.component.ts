import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '../core/store/auth.store';

@Component({
  selector: 'app-login',
  imports: [ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authStore = inject(AuthStore);

  login(): void {
    this.authStore.login();
  }
}
