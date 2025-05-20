import { Component } from '@angular/core';
import { GoogleAuthService } from '../../../core/services/google-auth.service';

@Component({
  selector: 'app-user-menu',
  imports: [],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
})
export class UserMenuComponent {
  isUserMenuOpen = false;

  get userPicture(): string | null {
    return localStorage.getItem('userPicture');
  }

  get userName(): string {
    return localStorage.getItem('userName') || 'User';
  }

  constructor(private googleAuthService: GoogleAuthService) {}

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  signOut() {
    this.googleAuthService.signOut().subscribe();
  }
}
