import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ToastComponent } from './components/toast/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastComponent],
  template: `
    <app-toast></app-toast>
    <app-header />
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    main { min-height: calc(100vh - 60px); background: #f5f5f5; }
  `]
})
export class App {}
