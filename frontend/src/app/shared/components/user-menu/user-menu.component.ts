import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { OrganizationService } from '../../services/organization.service';

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

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private elementRef = inject(ElementRef);
  private organizationService = inject(OrganizationService);

  ngOnInit() {
    this.loadUserStatus();
  }

  private loadUserStatus() {
    this.userService.getUserStatus().subscribe({
      next: (status) => {
        this.organizations = status.organizations || [];
        this.currentOrganizationName = status.currentOrganizationName || null;
      },
      error: (error: any) => {
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

  checkoutToOrganization(id: number) {
    console.log('checkoutToOrganization()');
    this.organizationService.switchToOrganization(id);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isUserMenuOpen = false;
    }
  }
}
