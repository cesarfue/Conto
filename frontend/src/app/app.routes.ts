import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/components/auth.component';
import { authGuard, loginGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/transactions/components/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [loginGuard],
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
