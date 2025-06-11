import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganizationService } from '../../../shared/services/organization.service';
import { UserService } from '../../../shared/services/user.service';

interface Member {
  id: number;
  email: string;
  isAdmin: boolean;
}

@Component({
  selector: 'app-manage-organization',
  imports: [CommonModule, FormsModule],
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

  private organizationService = inject(OrganizationService);
  private userService = inject(UserService);

  ngOnInit() {
    this.loadUserStatus();
  }

  private loadUserStatus() {
    this.userService.getUserStatus().subscribe({
      next: (status) => {
        this.hasOrganization = status.hasOrganization;
        this.organizationName = status.currentOrganizationName;
        this.organizationId = status.currentOrganizationId;
        this.isLoading = false;

        if (this.hasOrganization && this.organizationId) {
          this.loadOrganizationDetails();
        }
      },
      error: (error: any) => {
        console.error('Failed to load user status:', error);
        this.isLoading = false;
      },
    });
  }

  private loadOrganizationDetails() {
    if (!this.organizationId) return;

    this.organizationService
      .getOrganizationDetails(this.organizationId)
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
    if (!this.newOrganizationName.trim() || !this.organizationId) return;

    this.organizationService
      .updateOrganizationName(this.organizationId, this.newOrganizationName)
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
    if (!this.inviteEmail.trim() || !this.organizationId) return;

    this.organizationService
      .sendInvitation(this.organizationId, this.inviteEmail)
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
    if (!this.organizationId) return;

    this.organizationService
      .promoteToAdmin(this.organizationId, memberId)
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
    if (!this.organizationId) return;

    this.organizationService
      .demoteFromAdmin(this.organizationId, memberId)
      .subscribe({
        next: () => {
          alert('Admin privileges removed successfully!');
          this.loadOrganizationDetails();
        },
        error: (error: any) => {
          console.error('Failed to demote member:', error);
          alert('Failed to remove admin privileges.');
        },
      });
  }

  removeMember(memberId: number) {
    if (
      !confirm('Are you sure you want to remove this member?') ||
      !this.organizationId
    )
      return;

    this.organizationService
      .removeMember(this.organizationId, memberId)
      .subscribe({
        next: () => {
          alert('Member removed successfully!');
          this.loadOrganizationDetails();
        },
        error: (error: any) => {
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
    if (!this.organizationId) return;

    this.organizationService.deleteOrganization(this.organizationId).subscribe({
      next: () => {
        alert('Organization deleted successfully!');
        this.showDeleteConfirmation = false;
        window.location.reload(); // Refresh to update state
      },
      error: (error: any) => {
        console.error('Failed to delete organization:', error);
        alert('Failed to delete organization.');
        this.showDeleteConfirmation = false;
      },
    });
  }
}
