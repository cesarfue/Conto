import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

interface OrganizationDetails {
  id: number;
  name: string;
  members: Array<{
    id: number;
    email: string;
    isAdmin: boolean;
  }>;
  isCurrentUserAdmin: boolean;
  currentUserId: number;
}

interface ApiResponse {
  message: string;
  organizationId?: number;
  joinCode?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private apiUrl = 'http://localhost:8080/api/organizations';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getOrganizationDetails(id: number): Observable<OrganizationDetails> {
    return this.http.get<OrganizationDetails>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  createOrganization(name: string, email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/create`,
      { name, email },
      { headers: this.authService.getAuthHeaders() },
    );
  }

  joinOrganization(joinCode: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/join`,
      { joinCode },
      { headers: this.authService.getAuthHeaders() },
    );
  }

  updateOrganizationName(id: number, name: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.apiUrl}/${id}`,
      { name },
      { headers: this.authService.getAuthHeaders() },
    );
  }

  sendInvitation(id: number, email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/${id}/invite`,
      { email },
      { headers: this.authService.getAuthHeaders() },
    );
  }

  promoteToAdmin(
    organizationId: number,
    userId: number,
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/${organizationId}/promote`,
      { userId },
      { headers: this.authService.getAuthHeaders() },
    );
  }

  demoteFromAdmin(
    organizationId: number,
    userId: number,
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/${organizationId}/demote`,
      { userId },
      { headers: this.authService.getAuthHeaders() },
    );
  }

  removeMember(
    organizationId: number,
    memberId: number,
  ): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.apiUrl}/${organizationId}/members/${memberId}`,
      {
        headers: this.authService.getAuthHeaders(),
      },
    );
  }

  switchToOrganization(organizationId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/${organizationId}/switch`,
      {},
      { headers: this.authService.getAuthHeaders() },
    );
  }

  deleteOrganization(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }
}
