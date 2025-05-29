import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.scss',
})
export class OrganizationComponent {
  isJoinMode = true;

  joinCode = '';

  organizationName = '';
  organizationEmail = '';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  toggleMode() {
    this.isJoinMode = !this.isJoinMode;
  }

  onJoinOrganization() {
    const headers = this.getAuthHeaders();

    this.http
      .post(
        'http://localhost:8080/api/organizations/join',
        { joinCode: this.joinCode },
        { headers },
      )
      .subscribe({
        next: () => {
          alert('Successfully joined organization!');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          alert('Failed to join organization. Please check your join code.');
          console.error(error);
        },
      });
  }

  onCreateOrganization() {
    const headers = this.getAuthHeaders();

    this.http
      .post(
        'http://localhost:8080/api/organizations/create',
        {
          name: this.organizationName,
          email: this.organizationEmail,
        },
        { headers },
      )
      .subscribe({
        next: () => {
          alert('Organization created successfully!');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          alert('Failed to create organization.');
          console.error(error);
        },
      });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
