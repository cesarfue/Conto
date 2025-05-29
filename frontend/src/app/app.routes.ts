import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/components/auth.component';
import { authGuard, loginGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/transactions/components/dashboard/dashboard.component';
import {
  organizationSelectGuard,
  organizationAuthGuard,
} from './core/guards/organization.guard';
import { OrganizationComponent } from './features/auth/components/organization/organization.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, organizationAuthGuard],
  },
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'organization',
    component: OrganizationComponent,
    canActivate: [authGuard, organizationSelectGuard],
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
