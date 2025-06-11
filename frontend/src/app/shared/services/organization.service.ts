import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  private http: HttpClient = inject(HttpClient);

  getOrganizationDetails(id: number): Observable<OrganizationDetails> {
    return this.http.get<OrganizationDetails>(`${this.apiUrl}/${id}`);
  }

  createOrganization(name: string, email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/create`, {
      name,
      email,
    });
  }

  joinOrganization(joinCode: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/join`, { joinCode });
  }

  updateOrganizationName(id: number, name: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}`, { name });
  }

  sendInvitation(id: number, email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/${id}/invite`, {
      email,
    });
  }

  promoteToAdmin(
    organizationId: number,
    userId: number,
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/${organizationId}/promote`,
      { userId },
    );
  }

  demoteFromAdmin(
    organizationId: number,
    userId: number,
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/${organizationId}/demote`,
      { userId },
    );
  }

  removeMember(
    organizationId: number,
    memberId: number,
  ): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.apiUrl}/${organizationId}/members/${memberId}`,
    );
  }

  switchToOrganization(organizationId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/${organizationId}/switch`,
      {},
    );
  }

  deleteOrganization(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }
}
