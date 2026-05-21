import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  form = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  };

  touched = {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false
  };

  error = '';
  success = false;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;
  passwordStrength = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  markTouched(field: keyof typeof this.touched) {
    this.touched[field] = true;
  }

  get firstNameInvalid() { return this.touched.firstName && this.form.firstName.trim() === ''; }
  get lastNameInvalid() { return this.touched.lastName && this.form.lastName.trim() === ''; }
  get emailInvalid() { return this.touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email); }
  get passwordInvalid() { return this.touched.password && this.form.password.length < 6; }
  get confirmPasswordInvalid() { return this.touched.confirmPassword && this.form.confirmPassword !== this.form.password; }
  get phoneInvalid() { return this.touched.phone && !/^[0-9]{10}$/.test(this.form.phone); }

  get isFormValid(): boolean {
    return (
      this.form.firstName.trim() !== '' &&
      this.form.lastName.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email) &&
      this.form.password.length >= 6 &&
      this.form.confirmPassword === this.form.password &&
      /^[0-9]{10}$/.test(this.form.phone)
    );
  }

  checkPasswordStrength() {
    const p = this.form.password;

    let strength = 0;

    if (p.length >= 6) strength += 20;
    if (p.length >= 8) strength += 15;
    if (/[a-z]/.test(p)) strength += 15;
    if (/[A-Z]/.test(p)) strength += 15;
    if (/[0-9]/.test(p)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(p)) strength += 20;

    this.passwordStrength = Math.min(100, strength);
  }

  onSubmit() {

    Object.keys(this.touched).forEach(
      key => (this.touched[key as keyof typeof this.touched] = true)
    );

    if (!this.isFormValid) return;

    this.loading = true;
    this.error = '';
    this.success = false;

    const { confirmPassword, ...payload } = this.form;

    this.authService
      .register(payload)
      .subscribe({

        next: (res) => {

          this.loading = false;

          if (res.success) {

            this.success = true;

            this.notificationService.showSuccess(
              'Registration successful'
            );

            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1500);

          } else {

            this.error = res.message;

            this.notificationService.showError(
              res.message || 'Registration failed'
            );
          }
        },

        error: () => {

          this.loading = false;

          this.error =
            'Registration failed. Please try again.';

          this.notificationService.showError(
            'Registration failed. Please try again.'
          );
        }
      });
  }
}