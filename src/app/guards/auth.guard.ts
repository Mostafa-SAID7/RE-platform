import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

/**
 * AuthGuard - Protects routes requiring authentication
 * 
 * Usage:
 * - Add to route's canActivate array
 * - Optionally specify required roles in route data: { roles: ['admin', 'property_manager'] }
 * 
 * Features:
 * - Redirects unauthenticated users to login with returnUrl
 * - Checks role-based access if roles are specified in route data
 * - Redirects unauthorized users to /unauthorized page
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    // Store the attempted URL for redirecting after login
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Check role-based access if roles are specified
  const requiredRoles = route.data['roles'] as UserRole[];
  if (requiredRoles && requiredRoles.length > 0) {
    if (!authService.hasAnyRole(requiredRoles)) {
      router.navigate(['/unauthorized']);
      return false;
    }
  }

  return true;
};
