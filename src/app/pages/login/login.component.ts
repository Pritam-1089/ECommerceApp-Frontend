import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  error = '';
  loading = false;
  showPassword = false;
  emailFocused = false;
  passFocused = false;
  loginForm: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  }

 onSubmit() {

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.loading = true;
  this.error = '';

  const payload = {
    email: this.loginForm.value.email,
    password: this.loginForm.value.password
  };

  this.authService.login(payload).subscribe({

    next: (res) => {
      this.loading = false;

      if (res.success) {

        this.notificationService.showSuccess(
          'Login successful'
        );

        this.router.navigate(['/']);

      } else {

        this.error = res.message ?? 'Something went wrong';

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
