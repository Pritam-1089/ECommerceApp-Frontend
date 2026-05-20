import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email = '';
  password = '';
  error = '';
  loading = false;
  showPassword = false;
  emailFocused = false;
  passFocused = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({

      next: (res) => {
        this.loading = false;

        if (res.success) {

          this.notificationService.showSuccess(
            'Login successful'
          );

          this.router.navigate(['/']);

        } else {

          this.error = res.message;

          this.notificationService.showError(
            res.message || 'Invalid email or password'
          );
        }
      },

      error: () => {
        this.loading = false;

        this.error =
          'Login failed. Please try again.';

        this.notificationService.showError(
          'Invalid email or password'
        );
      }
    });
  }
}
