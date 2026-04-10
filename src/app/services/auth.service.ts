import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { User, UserRole } from '../models/user.model';
import { environment } from '../../environments/environment';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface TokenRefreshResponse {
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';

  // Signals for reactive state
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSignal = signal<boolean>(this.hasValidToken());
  public isAuthenticated$ = computed(() => this.isAuthenticatedSignal());

  constructor() {
    // Initialize authentication state from storage
    this.initializeAuthState();
  }

  /**
   * Initialize authentication state from localStorage
   */
  private initializeAuthState(): void {
    const token = this.getToken();
    const user = this.getUserFromStorage();
    
    if (token && user) {
      this.isAuthenticatedSignal.set(true);
      this.currentUserSubject.next(user);
    } else {
      this.clearSession();
    }
  }

  /**
   * Login with email and password
   */
  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setSession(response);
        }),
        map(response => response.user),
        catchError(error => {
          console.error('Login failed:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Logout and clear session
   */
  logout(): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/logout`, {})
      .pipe(
        tap(() => {
          this.clearSession();
          this.router.navigate(['/auth/login']);
        }),
        catchError(error => {
          // Clear session even if API call fails
          this.clearSession();
          this.router.navigate(['/auth/login']);
          return of(void 0);
        })
      );
  }

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      this.clearSession();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<TokenRefreshResponse>(
      `${environment.apiUrl}/auth/refresh`,
      { refreshToken }
    ).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setRefreshToken(response.refreshToken);
      }),
      map(response => response.token),
      catchError(error => {
        this.clearSession();
        return throwError(() => error);
      })
    );
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.hasValidToken() && this.currentUserSubject.value !== null;
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  /**
   * Check if user has permission for a resource and action
   */
  hasPermission(resource: string, action: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    return user.permissions.some(
      permission => 
        permission.resource === resource && 
        permission.actions.includes(action as any)
    );
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Set session data after successful login
   */
  private setSession(response: LoginResponse): void {
    this.setToken(response.token);
    this.setRefreshToken(response.refreshToken);
    this.setUser(response.user);
    this.isAuthenticatedSignal.set(true);
    this.currentUserSubject.next(response.user);
  }

  /**
   * Clear session data
   */
  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticatedSignal.set(false);
    this.currentUserSubject.next(null);
  }

  /**
   * Store token in localStorage
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Store refresh token in localStorage
   */
  private setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  /**
   * Store user data in localStorage
   */
  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Retrieve user from localStorage
   */
  private getUserFromStorage(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData) return null;

    try {
      return JSON.parse(userData) as User;
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  }

  /**
   * Check if token exists (basic validation)
   */
  private hasValidToken(): boolean {
    const token = this.getToken();
    return token !== null && token.length > 0;
  }
}
