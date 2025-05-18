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

  // Your client ID from Google Cloud Console
  private clientId =
    '1068314139716-ooc63lc2fufv5sjpak0nqcmfu3r2nvol.apps.googleusercontent.com';
  initialize() {
    // Initialize Google Identity Services
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    this.isInitialized.next(true);
  }

  private handleCredentialResponse(response: any) {
    // Send the token to your backend for verification and login
    this.http
      .post('/api/auth/google', {
        token: response.credential,
      })
      .subscribe({
        next: (authResult: any) => {
          // Use the login method from your existing auth service
          // Assuming your login method accepts token or credentials
          this.authService
            .login(authResult.email, authResult.token)
            .subscribe(() => {
              // Handle successful login - you may need to adjust this based on your service
              console.log('Successfully logged in with Google');
            });
        },
        error: (error) => {
          console.error('Google authentication error:', error);
        },
      });
  }

  renderButton(elementId: string) {
    // Make sure Google Identity Services is initialized
    if (this.isInitialized.value) {
      google.accounts.id.renderButton(document.getElementById(elementId), {
        theme: 'outline',
        size: 'large',
        width: '100%',
      });
    }
  }

  promptOneTap() {
    if (this.isInitialized.value) {
      google.accounts.id.prompt();
    }
  }
}
