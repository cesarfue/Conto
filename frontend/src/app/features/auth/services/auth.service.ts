import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface UserStatus {
  hasOrganization: boolean;
  email: string;
  organizationId: number | null;
  organizationName: string | null;
}

declare var google: any;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authState = new BehaviorSubject<boolean>(this.checkToken());
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          // Clear any existing Google profile data for regular login
          localStorage.removeItem('userPicture');
          // Extract name from email (everything before @)
          const userName = email.split('@')[0];
          localStorage.setItem('userName', userName);
          this.setLoggedIn(response.token);
        }
      }),
    );
  }

  register(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          // Clear any existing Google profile data for regular registration
          localStorage.removeItem('userPicture');
          // Extract name from email (everything before @)
          const userName = email.split('@')[0];
          localStorage.setItem('userName', userName);
          this.setLoggedIn(response.token);
        }
      }),
    );
  }

  getUserStatus(): Observable<UserStatus> {
    const headers = this.getAuthHeaders();
    return this.http.get<UserStatus>(`${this.apiUrl}/status`, { headers });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  authStatus(): Observable<boolean> {
    return this.authState.asObservable();
  }

  private checkToken(): boolean {
    return !!localStorage.getItem('token');
  }

  setLoggedIn(token: string): void {
    localStorage.setItem('token', token);
    this.authState.next(true);
  }

  // Unified logout method that handles both Google and regular users
  logout(): Observable<any> {
    // Check if user was logged in with Google (has userPicture)
    const wasGoogleUser = !!localStorage.getItem('userPicture');

    // Disable Google auto-select if user was a Google user
    if (wasGoogleUser && typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.disableAutoSelect();
    }

    // Clear all localStorage data
    localStorage.removeItem('token');
    localStorage.removeItem('userPicture');
    localStorage.removeItem('userName');

    // Update auth state
    this.authState.next(false);

    // Call backend logout endpoint
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      catchError((error) => {
        console.error('Error during logout:', error);
        return of(null);
      }),
      tap(() => {
        // Redirect to auth page
        window.location.href = '/auth';
      }),
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
