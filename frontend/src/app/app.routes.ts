import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/components/auth.component';
import {
  authGuard,
  loginGuard,
  mustHaveOrganizationGuard,
} from './core/guards/auth.guard';
import { DashboardComponent } from './features/transactions/components/dashboard/dashboard.component';
import { ManageOrganizationComponent } from './features/organizations/manage-organization/manage-organization.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, mustHaveOrganizationGuard],
  },
  {
    path: 'manage-organization',
    component: ManageOrganizationComponent,
  },
  {
    path: 'join-or-create-organization',
    loadComponent: () =>
      import(
        './shared/components/join-or-create-organization/join-or-create-organization.component'
      ).then((m) => m.JoinOrCreateOrganizationComponent),
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
