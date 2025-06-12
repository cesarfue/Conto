import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-join-or-create-organization',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './join-or-create-organization.component.html',
  styleUrl: './join-or-create-organization.component.scss',
})
export class JoinOrCreateOrganizationComponent {
  isJoinMode = true;
  joinCode = '';
  organizationName = '';
  organizationEmail = '';

  private http = inject(HttpClient);

  toggleMode() {
    this.isJoinMode = !this.isJoinMode;
  }

  onJoinOrganization() {
    this.http
      .post('http://localhost:8080/api/organizations/join', {
        joinCode: this.joinCode,
      })
      .subscribe({
        next: () => {
          window.location.reload();
          // router()
        },
        error: (error) => {
          alert('Failed to join organization. Please check your join code.');
          console.error(error);
        },
      });
  }

  onCreateOrganization() {
    this.http
      .post('http://localhost:8080/api/organizations/create', {
        name: this.organizationName,
        email: this.organizationEmail,
      })
      .subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          alert('Failed to create organization.');
          console.error(error);
        },
      });
  }
}
