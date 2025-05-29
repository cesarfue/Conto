import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
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

  showPassword: boolean = false;
  errorMessage: string = '';
  showError: boolean = false;

  private auth = inject(AuthService);

  onRegister() {
    this.auth.register(this.email, this.password).subscribe({
      next: () => {
        console.log('Register successeful');
      },
      error: (error) => {
        this.showError = true;

        if (error.status === 404) {
          this.errorMessage = 'Email not found';
        } else if (error.status === 401) {
          this.errorMessage = 'Invalid password';
        } else {
          this.errorMessage = 'Register failed. Please try again.';
        }
      },
    });
  }
}
