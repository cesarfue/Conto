import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-auth',
  imports: [LoginComponent, RegisterComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  isLoginMode: boolean = true;

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onRegistrationSuccess() {
    this.isLoginMode = true;
  }
}
