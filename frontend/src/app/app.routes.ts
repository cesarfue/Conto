import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/components/auth.component';
import { authGuard, loginGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/transactions/components/dashboard/dashboard.component';
import { mustHaveOrganizationGuard } from './core/guards/organization.guard';
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
    canActivate: [authGuard],
  },
  {
    path: 'join-or-create-organization',
    loadComponent: () =>
      import(
        './shared/components/join-or-create-organization/join-or-create-organization.component'
      ).then((m) => m.JoinOrCreateOrganizationComponent),
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
