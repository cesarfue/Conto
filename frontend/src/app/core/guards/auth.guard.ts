import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { UserService } from '../../shared/services/user.service';

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
    const userService = inject(UserService);

    return userService.getUserStatus().pipe(
      map((response) => {
        const hasOrganization = response.hasOrganization;

        if (hasOrganization === shouldHaveOrganization) {
          return true;
        } else {
          return router.parseUrl(redirectPath);
        }
      }),
      catchError((error) => {
        throw error;
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
