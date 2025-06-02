import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard = () => {
  const router = inject(Router);

  if (!isLoggedIn()) {
    return router.parseUrl('/auth');
  }
  return true;
};

export const loginGuard = () => {
  const router = inject(Router);

  if (isLoggedIn()) {
    return router.parseUrl('/dashboard');
  }

  return true;
};

export const mustHaveOrganizationGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!isLoggedIn()) {
    return router.parseUrl('/auth');
  }

  return authService.getUserStatus().pipe(
    map((response) => {
      if (response.hasOrganization) {
        console.log('User has organization');
        return true;
      } else {
        console.log('User doesnt have organization');
        return router.parseUrl('/join-or-create-organization');
      }
    }),
    catchError((error) => {
      console.error('Error checking organization status:', error);
      return of(router.parseUrl('/auth'));
    }),
  );
};

function isLoggedIn(): boolean {
  return !!localStorage.getItem('token');
}
