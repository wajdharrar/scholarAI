import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface AuthenticationResponse {
  accessToken: string;
  refreshToken: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';
  private tokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthentication();
  }

  /**
   * Login user with email and password
   */
  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        this.storeTokens(response.accessToken, response.refreshToken);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  /**
   * Register a new user
   */
  register(request: RegistrationRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, request);
  }

  /**
   * Refresh the access token
   */
  refreshToken(): Observable<AuthenticationResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const request: RefreshRequest = { refreshToken };
    return this.http.post<AuthenticationResponse>(`${this.apiUrl}/refresh`, request).pipe(
      tap(response => {
        this.storeTokens(response.accessToken, response.refreshToken);
      })
    );
  }

  /**
   * Store tokens in localStorage
   */
  private storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.tokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  /**
   * Check if token exists
   */
  hasToken(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Check authentication status
   */
  checkAuthentication(): void {
    this.isAuthenticatedSubject.next(this.hasToken());
  }

  /**
   * Get authentication status
   */
  isAuthenticated(): boolean {
    return this.hasToken();
  }
}
