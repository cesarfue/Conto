import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-manage-organization',
  imports: [CommonModule],
  templateUrl: './manage-organization.component.html',
  styleUrl: './manage-organization.component.scss',
})
export class ManageOrganizationComponent implements OnInit {
  hasOrganization = false;
  organizationName: string | null = null;
  isLoading = true;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserStatus();
  }

  private loadUserStatus() {
    this.authService.getUserStatus().subscribe({
      next: (status) => {
        this.hasOrganization = status.hasOrganization;
        this.organizationName = status.organizationName;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load user status:', error);
        this.isLoading = false;
      },
    });
  }
}
