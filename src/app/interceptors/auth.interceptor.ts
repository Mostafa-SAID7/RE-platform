import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * HTTP Interceptor that attaches JWT authentication tokens to outgoing requests
 * 
 * This interceptor:
 * - Retrieves the JWT token from AuthService
 * - Adds Authorization header to all API requests
 * - Skips authentication for public endpoints (login, register, etc.)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Skip authentication for public endpoints
  const publicEndpoints = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password'
  ];
  
  const isPublicEndpoint = publicEndpoints.some(endpoint => 
    req.url.includes(endpoint)
  );
  
  if (isPublicEndpoint) {
    return next(req);
  }
  
  // Get token from AuthService
  const token = authService.getToken();
  
  // If token exists, clone request and add Authorization header
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }
  
  // No token, proceed with original request
  return next(req);
};
