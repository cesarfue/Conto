import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const mustHaveOrganizationGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

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
      // If there's an error, redirect to auth instead of creating a loop
      return of(router.parseUrl('/auth'));
    }),
  );
};
