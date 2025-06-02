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

enum RoutePaths {
  AUTH = '/auth',
  DASHBOARD = '/dashboard',
  JOIN_OR_CREATE_ORG = '/join-or-create-organization',
}

const createOrganizationStatusGuard = (
  shouldHaveOrganization: boolean,
  redirectPath: string,
) => {
  return () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (!isLoggedIn()) {
      return router.parseUrl(RoutePaths.AUTH);
    }

    return authService.getUserStatus().pipe(
      map((response) => {
        const hasOrganization = response.hasOrganization;

        if (hasOrganization === shouldHaveOrganization) {
          return true;
        } else {
          return router.parseUrl(redirectPath);
        }
      }),
      catchError((error) => {
        console.error('Error checking organization status:', error);
        return of(router.parseUrl(RoutePaths.AUTH));
      }),
    );
  };
};

export const requiresOrganizationGuard = createOrganizationStatusGuard(
  true,
  RoutePaths.JOIN_OR_CREATE_ORG,
);

export const requiresNoOrganizationGuard = createOrganizationStatusGuard(
  false,
  RoutePaths.DASHBOARD,
);

function isLoggedIn(): boolean {
  return !!localStorage.getItem('token');
}
