import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AdminGuard - Protects routes requiring admin role
 * 
 * Usage:
 * - Add to route's canActivate array (typically after AuthGuard)
 * - Example: canActivate: [authGuard, adminGuard]
 * 
 * Features:
 * - Ensures only users with 'admin' role can access the route
 * - Redirects non-admin users to /unauthorized page
 * - Should be used in combination with AuthGuard
 */
export const adminGuard: CanActivateFn = (): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user has admin role
  if (!authService.hasRole('admin')) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
