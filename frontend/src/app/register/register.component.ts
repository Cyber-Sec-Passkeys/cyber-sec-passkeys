import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { AuthStore } from '../core/store/auth.store';

@Component({
  imports: [ButtonModule, DividerModule, InputTextModule],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  authStore = inject(AuthStore);

  register(): void {
    this.authStore.register();
  }
}
