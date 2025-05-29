import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authState = new BehaviorSubject<boolean>(this.checkToken());

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<{
        token: string;
      }>('http://localhost:8080/api/auth/login', { email, password })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.authState.next(true);
          this.router.navigate(['/dashboard']);
        }),
      );
  }

  register(email: string, password: string): Observable<any> {
    return this.http
      .post<{
        token: string;
      }>('http://localhost:8080/api/auth/register', { email, password })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.authState.next(true);
          this.router.navigate(['/dashboard']);
        }),
      );
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
    this.router.navigate(['/auth']);
  }
}
