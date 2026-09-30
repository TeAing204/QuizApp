import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Auth Interceptor (Angular 18 functional style)
 * - Tự động gắn header Authorization: Bearer <token> vào mọi HTTP request
 * - Xử lý response 401 Unauthorized: tự động logout và redirect về trang Login
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Gắn token nếu có
  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Skip 401 handling for auth endpoints (login/register)
        // so the component can display the error message to the user
        const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register');
        if (!isAuthEndpoint) {
          authService.logout();
          router.navigate(['/auth/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
