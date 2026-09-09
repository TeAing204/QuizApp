import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginDto, RegisterDto, LoginResponse, UserViewModel } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<UserViewModel | null>(this.getStoredUser());

  /** Observable cho component subscribe */
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(dto: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, dto).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  register(dto: RegisterDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, dto).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Kiểm tra token hết hạn
    const expires = localStorage.getItem('token_expires');
    if (expires && new Date(expires) < new Date()) {
      this.logout();
      return false;
    }
    return true;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles === 'Administrator';
  }

  getCurrentUser(): UserViewModel | null {
    return this.currentUserSubject.value;
  }

  private handleAuthSuccess(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('token_expires', response.expires);
    localStorage.setItem('user', JSON.stringify(response.userInformation));
    this.currentUserSubject.next(response.userInformation);
  }

  private getStoredUser(): UserViewModel | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
}
