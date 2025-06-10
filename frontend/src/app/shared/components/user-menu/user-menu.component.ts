import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { GoogleAuthService } from '../../../features/auth/services/google-auth.service';
import { AuthService } from '../../../features/auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-menu',
  imports: [CommonModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
})
export class UserMenuComponent implements OnInit {
  isUserMenuOpen = false;
  organizations: Array<{
    id: number;
    name: string;
    role: string;
    isCurrent: boolean;
  }> | null = null;
  currentOrganizationName: string | null = null;
  isLoadingOrganization = true;

  get userPicture(): string | null {
    return localStorage.getItem('userPicture');
  }

  get userName(): string {
    return localStorage.getItem('userName') || 'User';
  }

  constructor(
    private googleAuthService: GoogleAuthService,
    private authService: AuthService,
    public elementRef: ElementRef,
  ) {}

  ngOnInit() {
    this.loadUserStatus();
  }

  private loadUserStatus() {
    this.authService.getUserStatus().subscribe({
      next: (status) => {
        this.organizations = status.organizations || [];
        this.currentOrganizationName = status.currentOrganizationName || null;
      },
      error: (error) => {
        console.error('Failed to load user status:', error);
        this.isLoadingOrganization = false;
      },
    });
  }

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
    this.authService.logout().subscribe();
  }

  checkoutToOrganization() {
    console.log('checkoutToOrganization()');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isUserMenuOpen = false;
    }
  }
}
