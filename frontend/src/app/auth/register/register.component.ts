import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  email = '';
  password = '';

  constructor(private auth: AuthService) {}

  onRegister() {
    this.auth.register(this.email, this.password).subscribe(() => {
      alert('Registered');
    });
  }
}
