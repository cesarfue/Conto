import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  if (isLoggedIn()) {
    return true;
  }
  return router.parseUrl('/auth');
};

export const loginGuard = () => {
  const router = inject(Router);
  if (isLoggedIn()) {
    return router.parseUrl('/dashboard');
  }
  return true;
};

function isLoggedIn(): boolean {
  return !!localStorage.getItem('token');
}
