import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('access_token');

    // Add token to request if available
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }

        // Handle 403 Forbidden
        if (error.status === 403) {
          this.authService.logout();
          this.router.navigate(['/sign-in']);
          return throwError(() => error);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const refreshToken = this.authService.getRefreshToken();

    if (!refreshToken) {
      this.authService.logout();
      this.router.navigate(['/sign-in']);
      return throwError(() => new Error('Unauthorized'));
    }

    // Try to refresh the token
    return this.authService.refreshToken().pipe(
      switchMap(() => {
        // Get the new token
        const newToken = this.authService.getAccessToken();
        if (newToken) {
          // Retry the original request with the new token
          const clonedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`
            }
          });
          return next.handle(clonedRequest);
        }
        throw new Error('Token refresh failed');
      }),
      catchError((err) => {
        // Token refresh failed, logout and redirect
        this.authService.logout();
        this.router.navigate(['/sign-in']);
        return throwError(() => err);
      })
    );
  }
}
