import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword: boolean = false;
  keepLoggedIn: boolean = false;

  constructor(private auth: AuthService) {}

  onLogin() {
    this.auth.login(this.email, this.password).subscribe(() => {
      alert('Logged in!');
    });
  }
}
