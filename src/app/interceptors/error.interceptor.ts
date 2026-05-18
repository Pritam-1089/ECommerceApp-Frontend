import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      console.error('HTTP Error:', error);

      switch (error.status) {

        case 0:
          alert('No internet connection');
          break;


        case 401:

  if (req.url.includes('/login') || req.url.includes('/register')) {
    alert('Invalid username or password');
    break;
  }

  alert('Session expired. Please login again.');

  authService.logout();
  router.navigate(['/login']);
  break;


        case 403:
          alert('Access denied');
          break;


        case 500:
          alert('Something went wrong');
          break;

        default:
          console.warn('Unhandled error:', error);
          break;
      }

      return throwError(() => error);
    })
  );
};