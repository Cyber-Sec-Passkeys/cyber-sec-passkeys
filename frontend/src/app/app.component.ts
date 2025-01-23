import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { AuthStore } from './core/store/auth.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menubar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'cyber-sec-passkey-frontend';

  items: MenuItem[] | undefined;

  store = inject(AuthStore);

  ngOnInit(): void {
    this.items = [
      {
        label: 'Loans',
        icon: 'pi pi-building-columns',
      },
      {
        label: 'Login',
        icon: 'pi pi-sign-in',
      },
    ];
  }
}
