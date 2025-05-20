import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authState = new BehaviorSubject<boolean>(this.checkToken());
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post('/api/auth/login', { email, password });
  }

  register(email: string, password: string) {
    return this.http.post('/api/auth/register', { email, password });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  authStatus(): Observable<boolean> {
    return this.authState.asObservable();
  }

  private checkToken(): boolean {
    return !!localStorage.getItem('token');
  }

  setLoggedIn(token: string): void {
    localStorage.setItem('token', token);
    this.authState.next(true);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authState.next(false);
  }
}
