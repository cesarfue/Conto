import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

declare var google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private isInitialized = new BehaviorSubject<boolean>(false);
  isInitialized$ = this.isInitialized.asObservable();

  private clientId =
    '1068314139716-ooc63lc2fufv5sjpak0nqcmfu3r2nvol.apps.googleusercontent.com';
  initialize() {
    console.log('Initializing Google Auth with client ID:', this.clientId);

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
    console.log('handleCredentialResponse()');

    this.http
      .post<{ token: string; message?: string }>(
        'http://localhost:8080/api/auth/google',
        {
          token: response.credential,
        },
      )
      .subscribe({
        next: (authResult) => {
          // With proper typing, TypeScript knows authResult has a token property
          console.log('Backend auth response:', authResult);
          localStorage.setItem('token', authResult.token);

          // Navigate to protected page or update UI
          window.location.href = '/dashboard'; // Or use Angular Router
        },
        error: (error) => {
          console.error('Google authentication error:', error);
          alert('Failed to authenticate with Google. Please try again.');
        },
      });
  }

  renderButton(elementId: string) {
    // Make sure Google Identity Services is initialized
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
