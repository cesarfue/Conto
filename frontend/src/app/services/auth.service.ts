import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post('/api/login', { email, password });
  }

  register(email: string, password: string) {
    return this.http.post('/api/register', { email, password });
  }
}
