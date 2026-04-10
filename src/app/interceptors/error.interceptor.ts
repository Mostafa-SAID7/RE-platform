import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, retry, switchMap, throwError, timer, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * HTTP Interceptor that handles errors with retry logic and token refresh
 * 
 * This interceptor:
 * - Retries failed requests with exponential backoff for network/server errors
 * - Handles 401 errors by attempting token refresh
 * - Logs out user if token refresh fails
 * - Provides centralized error handling
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const retryCount = 3;
  const retryDelay = 1000;
  
  return next(req).pipe(
    retry({
      count: retryCount,
      delay: (error, retryAttempt) => {
        // Only retry on network errors (status 0) or server errors (5xx)
        if (shouldRetry(error)) {
          const delay = retryDelay * Math.pow(2, retryAttempt - 1);
          console.log(`Retrying request (${retryAttempt}/${retryCount}) after ${delay}ms`);
          return timer(delay);
        }
        // Don't retry, throw error immediately
        throw error;
      }
    }),
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized errors with token refresh
      if (error.status === 401 && !req.url.includes('/auth/')) {
        return handle401Error(req, next, authService);
      }
      
      // Log error for debugging
      console.error('HTTP Error:', {
        status: error.status,
        message: error.message,
        url: req.url
      });
      
      return throwError(() => error);
    })
  );
};

/**
 * Determines if a request should be retried based on the error
 */
function shouldRetry(error: any): boolean {
  return (
    error instanceof HttpErrorResponse &&
    (error.status === 0 || error.status >= 500)
  );
}

/**
 * Handles 401 errors by attempting to refresh the authentication token
 * If refresh succeeds, retries the original request with new token
 * If refresh fails, logs out the user
 */
function handle401Error(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<any>> {
  return authService.refreshToken().pipe(
    switchMap((token: string) => {
      // Clone request with new token
      const clonedReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next(clonedReq);
    }),
    catchError((error) => {
      // Token refresh failed, logout user
      authService.logout().subscribe();
      return throwError(() => error);
    })
  );
}
