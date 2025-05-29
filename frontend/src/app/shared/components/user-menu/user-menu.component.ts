import { Component, ElementRef, HostListener } from '@angular/core';
import { GoogleAuthService } from '../../../features/auth/services/google-auth.service';

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

  constructor(
    private googleAuthService: GoogleAuthService,
    public elementRef: ElementRef,
  ) {}

  hideUserMenu() {
    this.isUserMenuOpen = false;
  }

  showUserMenu() {
    this.isUserMenuOpen = true;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  signOut() {
    this.googleAuthService.signOut().subscribe();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isUserMenuOpen = false;
    }
  }
}
