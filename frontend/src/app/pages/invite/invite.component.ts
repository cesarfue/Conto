import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
})
export class InviteComponent {
  email: string = '';

  constructor(private http: HttpClient) {}

  submitInvite() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .post('/api/invitations', { email: this.email }, { headers })
      .subscribe({
        next: () => alert('Invitation sent!'),
        error: (err) => alert('Error sending invitation: ' + err.message),
      });
  }
}
