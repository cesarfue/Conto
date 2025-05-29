import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { GoogleAuthService } from '../../services/google-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  showPassword: boolean = false;
  keepLoggedIn: boolean = false;

  errorMessage: string = '';
  showError: boolean = false;

  private auth = inject(AuthService);
  private googleAuthService = inject(GoogleAuthService);

  ngOnInit() {
    // Initialize Google Identity Services
    this.googleAuthService.initialize();

    // Render the Google button once the service is initialized
    this.googleAuthService.isInitialized$.subscribe((initialized) => {
      if (initialized) {
        this.googleAuthService.renderButton('google-button-container');
      }
    });
  }

  onLogin() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        console.log('Login successful');
      },
      error: (error) => {
        this.showError = true;
        if (error.status === 404) {
          this.errorMessage = 'Email not found';
        } else if (error.status === 401) {
          this.errorMessage = 'Invalid password';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      },
    });
  }
}
