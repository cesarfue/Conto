import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        console.log('Token expired or invalid, logging out...');

        authService.clearAuthData();
        window.location.href = '/auth';

        return throwError(
          () => new Error('Session expired. Please log in again.'),
        );
      }

      if (error.status === 403) {
        console.log('Access forbidden');
        authService.clearAuthData();
        window.location.href = '/auth';

        return throwError(
          () => new Error('Access denied. Please log in again.'),
        );
      }

      return throwError(() => error);
    }),
  );
};
