import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

enum RoutePaths {
  AUTH = '/auth',
  DASHBOARD = '/dashboard',
  JOIN_OR_CREATE_ORG = '/join-or-create-organization',
}

function isAuth(): boolean {
  return !!localStorage.getItem('token');
}

const authGuard = (shouldBeAuthenticated: boolean, redirectPath: string) => {
  return () => {
    const router = inject(Router);
    const userIsAuth = isAuth();
    console.log(
      shouldBeAuthenticated ? 'requiresAuthGuard' : 'requiresNoAuthGuard',
    );

    if (userIsAuth === shouldBeAuthenticated) {
      return true;
    } else {
      return router.parseUrl(redirectPath);
    }
  };
};

export const requiresAuthGuard = authGuard(true, RoutePaths.AUTH);

export const requiresNoAuthGuard = authGuard(false, RoutePaths.DASHBOARD);

const organizationGuard = (
  shouldHaveOrganization: boolean,
  redirectPath: string,
) => {
  return () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.getUserStatus().pipe(
      map((response) => {
        const hasOrganization = response.hasOrganization;
        console.log('hasOrganization  = ', hasOrganization);

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

export const requiresOrganizationGuard = organizationGuard(
  true,
  RoutePaths.JOIN_OR_CREATE_ORG,
);

export const requiresNoOrganizationGuard = organizationGuard(
  false,
  RoutePaths.DASHBOARD,
);
