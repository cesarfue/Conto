import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const organizationAuthGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.getUserStatus().pipe(
    map((response) => {
      if (response.hasOrganization) {
        return true;
      } else {
        router.navigate(['/organization']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/auth']);
      return of(false);
    }),
  );
};

export const organizationSelectGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.getUserStatus().pipe(
    map((response) => {
      if (response.hasOrganization) {
        router.navigate(['/dashboard']);
        return false;
      } else {
        return true;
      }
    }),
    catchError(() => {
      router.navigate(['/auth']);
      return of(false);
    }),
  );
};
