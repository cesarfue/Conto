import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../features/auth/services/auth.service';
import { JoinOrCreateOrganizationComponent } from '../../../shared/components/join-or-create-organization/join-or-create-organization.component';

interface Member {
  id: number;
  email: string;
  isAdmin: boolean;
}

@Component({
  selector: 'app-manage-organization',
  imports: [CommonModule, JoinOrCreateOrganizationComponent, FormsModule],
  templateUrl: './manage-organization.component.html',
  styleUrl: './manage-organization.component.scss',
})
export class ManageOrganizationComponent implements OnInit {
  hasOrganization = false;
  organizationName: string | null = null;
  organizationId: number | null = null;
  isLoading = true;
  editingName = false;
  newOrganizationName = '';
  joinCode = '';
  members: Member[] = [];
  memberCount = 0;
  inviteEmail = '';
  isCurrentUserAdmin = false;
  currentUserId: number | null = null;
  showDeleteConfirmation = false;
  currentPane = 0;
  organizationsCount = 0;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.loadUserStatus();
  }

  private loadUserStatus() {
    this.authService.getUserStatus().subscribe({
      next: (status) => {
        this.hasOrganization = status.hasOrganization;
        this.organizationName = status.currentOrganizationName;
        this.organizationId = status.currentOrganizationId;
        this.isLoading = false;

        if (this.hasOrganization && this.organizationId) {
          this.loadOrganizationDetails();
        }
      },
      error: (error) => {
        console.error('Failed to load user status:', error);
        this.isLoading = false;
      },
    });
  }

  private loadOrganizationDetails() {
    const headers = this.getAuthHeaders();

    this.http
      .get<any>(
        `http://localhost:8080/api/organizations/${this.organizationId}`,
        { headers },
      )
      .subscribe({
        next: (org) => {
          this.members = org.members || [];
          this.memberCount = this.members.length;
          this.joinCode = `ORG-${this.organizationId}`;
          this.isCurrentUserAdmin = org.isCurrentUserAdmin || false;
          this.currentUserId = org.currentUserId;
        },
        error: (error) => {
          console.error('Failed to load organization details:', error);
        },
      });
  }

  toggleEditName() {
    this.editingName = true;
    this.newOrganizationName = this.organizationName || '';
  }

  cancelEditName() {
    this.editingName = false;
    this.newOrganizationName = '';
  }

  saveOrganizationName() {
    if (!this.newOrganizationName.trim()) return;

    const headers = this.getAuthHeaders();

    this.http
      .put(
        `http://localhost:8080/api/organizations/${this.organizationId}`,
        { name: this.newOrganizationName },
        { headers },
      )
      .subscribe({
        next: () => {
          this.organizationName = this.newOrganizationName;
          this.editingName = false;
          alert('Organization name updated successfully!');
        },
        error: (error) => {
          console.error('Failed to update organization name:', error);
          alert('Failed to update organization name.');
        },
      });
  }

  copyJoinCode() {
    navigator.clipboard
      .writeText(this.joinCode)
      .then(() => {
        alert('Join code copied to clipboard!');
      })
      .catch(() => {
        alert('Failed to copy join code');
      });
  }

  sendInvitation() {
    if (!this.inviteEmail.trim()) return;

    const headers = this.getAuthHeaders();

    this.http
      .post(
        `http://localhost:8080/api/organizations/${this.organizationId}/invite`,
        { email: this.inviteEmail },
        { headers },
      )
      .subscribe({
        next: () => {
          alert('Invitation sent successfully!');
          this.inviteEmail = '';
        },
        error: (error) => {
          console.error('Failed to send invitation:', error);
          alert('Failed to send invitation.');
        },
      });
  }

  promoteToAdmin(memberId: number) {
    const headers = this.getAuthHeaders();

    this.http
      .post(
        `http://localhost:8080/api/organizations/${this.organizationId}/promote`,
        { userId: memberId },
        { headers },
      )
      .subscribe({
        next: () => {
          alert('Member promoted to admin successfully!');
          this.loadOrganizationDetails();
        },
        error: (error) => {
          console.error('Failed to promote member:', error);
          alert('Failed to promote member.');
        },
      });
  }

  demoteFromAdmin(memberId: number) {
    const headers = this.getAuthHeaders();

    this.http
      .post(
        `http://localhost:8080/api/organizations/${this.organizationId}/demote`,
        { userId: memberId },
        { headers },
      )
      .subscribe({
        next: () => {
          alert('Admin privileges removed successfully!');
          this.loadOrganizationDetails();
        },
        error: (error) => {
          console.error('Failed to demote member:', error);
          alert('Failed to remove admin privileges.');
        },
      });
  }

  removeMember(memberId: number) {
    if (!confirm('Are you sure you want to remove this member?')) return;

    const headers = this.getAuthHeaders();

    this.http
      .delete(
        `http://localhost:8080/api/organizations/${this.organizationId}/members/${memberId}`,
        { headers },
      )
      .subscribe({
        next: () => {
          alert('Member removed successfully!');
          this.loadOrganizationDetails();
        },
        error: (error) => {
          console.error('Failed to remove member:', error);
          alert('Failed to remove member.');
        },
      });
  }

  confirmDeleteOrganization() {
    this.showDeleteConfirmation = true;
  }

  cancelDeleteOrganization() {
    this.showDeleteConfirmation = false;
  }

  deleteOrganization() {
    const headers = this.getAuthHeaders();

    this.http
      .delete(
        `http://localhost:8080/api/organizations/${this.organizationId}`,
        { headers },
      )
      .subscribe({
        next: () => {
          alert('Organization deleted successfully!');
          this.showDeleteConfirmation = false;
          window.location.reload(); // Refresh to update state
        },
        error: (error) => {
          console.error('Failed to delete organization:', error);
          alert('Failed to delete organization.');
          this.showDeleteConfirmation = false;
        },
      });
  }

  checkoutToOrganization() {
    console.log('checkoutToOrganization()');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
