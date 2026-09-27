import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import User from 'app/interfaces/User';
import { AuthenticationService } from './authentication.service';

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  [key: string]: any;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  institution: string;
  country: string;
  citationsCount: number;
  email: string;
  bio?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  papersCount: number;
  [key: string]: any;
}
export interface RequestHack {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/v1/users';


  constructor(private http: HttpClient , private authenticationService :AuthenticationService) { }
  

  /**
   * Update current user profile
   */
  updateProfile(request: any): Observable<any> {

    return this.http.patch<void>(`${this.apiUrl}/me`, request);
  }

  /**
   * Get current user information
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`);
  }
  /**
   * Get current user information
   */
  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}`);
  }

  /**
   * Change password
   */
  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/me/password`, request);
  }

  /**
   * Deactivate account
   */
  deactivateAccount(): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/me/deactivate`, {});
  }

  /**
   * Reactivate account
   */
  reactivateAccount(): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/me/reactivate`, {});
  }

  /**
   * Delete account
   */
  deleteAccount(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/me`);
  }
}
