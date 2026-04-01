import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  form = { firstName: '', lastName: '', email: '', password: '', phone: '' };
  error = '';
  success = false;
  loading = false;
  showPassword = false;
  passwordStrength = 0;

  constructor(private authService: AuthService, private router: Router) {}

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
    this.loading = true;
    this.error = '';
    this.success = false;
    this.authService.register(this.form).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          this.success = true;
          setTimeout(() => this.router.navigate(['/']), 1500);
        } else {
          this.error = res.message;
        }
      },
      error: () => { this.loading = false; this.error = 'Registration failed. Please try again.'; }
    });
  }
}
