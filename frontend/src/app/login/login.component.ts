import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { AuthStore } from '../core/store/auth.store';

@Component({
  selector: 'app-login',
  imports: [ButtonModule, DividerModule, InputTextModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  authStore = inject(AuthStore);
  router = inject(Router);

  ngOnInit(): void {
    if (this.authStore.authenticated()) {
      this.router.navigate(['/loans']);
    }
  }

  login(): void {
    this.authStore.login();
  }
}
