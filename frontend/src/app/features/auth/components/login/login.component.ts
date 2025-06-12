import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { GoogleAuthService } from '../../services/google-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword: boolean = false;
  keepLoggedIn: boolean = false;
  errorMessage: string = '';
  showError: boolean = false;

  private auth = inject(AuthService);
  private googleAuthService = inject(GoogleAuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.googleAuthService.initialize();
    this.googleAuthService.isInitialized$.subscribe((initialized) => {
      if (initialized) {
        this.googleAuthService.renderButton('google-button-container');
      }
    });
  }

  onLogin() {
    this.showError = false;
    this.errorMessage = '';

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.auth.login(email, password).subscribe({
        next: () => {
          console.log('Login successful');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.showError = true;

          if (error.status === 404) {
            this.errorMessage = 'Email not found';
          } else if (error.status === 401) {
            this.errorMessage = 'Invalid password';
          } else {
            this.errorMessage = error.status + ': Login failed';
          }
        },
      });
    } else {
      this.showError = true;
      this.errorMessage = 'Invalid password or username';
    }
  }
}
