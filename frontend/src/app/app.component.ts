import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { AuthStore } from './core/store/auth.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menubar, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  store = inject(AuthStore);
  router = inject(Router);
  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        label: 'Loans',
        icon: 'pi pi-list ',
        url: 'http://localhost:4200/loans',
      },
      {
        label: 'Login',
        icon: 'pi pi-sign-in',
        url: 'http://localhost:4200/login',
      },
      {
        label: 'Register',
        icon: 'pi pi-user-plus',
        url: 'http://localhost:4200/register',
      },
    ];
  }
}
