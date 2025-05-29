import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

declare var google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private http = inject(HttpClient);

  private isInitialized = new BehaviorSubject<boolean>(false);
  isInitialized$ = this.isInitialized.asObservable();

  private clientId =
    '1068314139716-ooc63lc2fufv5sjpak0nqcmfu3r2nvol.apps.googleusercontent.com';

  initialize() {
    if (typeof google === 'undefined') {
      setTimeout(() => this.initialize(), 100);
      return;
    }
    try {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      console.log('Google Auth initialized successfully');
      this.isInitialized.next(true);
    } catch (error) {
      console.error('Error initializing Google Auth:', error);
    }
  }

  private handleCredentialResponse(response: any) {
    try {
      const payload = jwtDecode(response.credential);
      if (payload && (payload as any).picture) {
        localStorage.setItem('userPicture', (payload as any).picture);
        localStorage.setItem('userName', (payload as any).name || '');
        console.log('google elements set to local storage.');
      }
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
    this.http
      .post<{ token: string; message?: string }>(
        'http://localhost:8080/api/auth/google',
        {
          token: response.credential,
        },
      )
      .subscribe({
        next: (authResult) => {
          localStorage.setItem('token', authResult.token);
          window.location.href = '/dashboard';
        },
        error: (error) => {
          console.error('Google authentication error:', error);
          alert('Failed to authenticate with Google. Please try again.');
        },
      });
  }

  renderButton(elementId: string) {
    if (this.isInitialized.value) {
      google.accounts.id.renderButton(document.getElementById(elementId), {
        theme: 'outline',
        size: 'large',
        width: '300',
      });
    }
  }

  promptOneTap() {
    if (this.isInitialized.value) {
      google.accounts.id.prompt();
    }
  }
}
