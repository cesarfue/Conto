import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

export interface UserStatus {
  hasOrganization: boolean;
  email: string;
  currentOrganizationId: number | null;
  currentOrganizationName: string | null;
  organizations: Array<{
    id: number;
    name: string;
    role: string;
    isCurrent: boolean;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private http: HttpClient = inject(HttpClient);
  private authService: AuthService = inject(AuthService);

  getUserStatus(): Observable<UserStatus> {
    return this.http.get<UserStatus>(`${this.apiUrl}/status`, {}).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.authService.clearAuthData();
        }
        return throwError(() => error);
      }),
    );
  }

  getUserProfile() {
    const picture = localStorage.getItem('userPicture');
    const name = localStorage.getItem('userName') || 'User';
    return { name, picture };
  }
}
