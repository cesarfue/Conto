import { Routes } from '@angular/router';
import { InviteComponent } from './pages/invite/invite.component';
import { AcceptInviteComponent } from './pages/accept-invite/accept-invite.component';

export const routes: Routes = [
  { path: 'invite', component: InviteComponent },
  { path: 'accept-invite', component: AcceptInviteComponent },
  { path: '', redirectTo: '/invite', pathMatch: 'full' },
];
