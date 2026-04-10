import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'hasAnyRole'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    mockRoute = {
      data: {}
    } as any;

    mockState = {
      url: '/dashboard'
    } as RouterStateSnapshot;
  });

  it('should allow access when user is authenticated and no roles required', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(
      ['/auth/login'],
      { queryParams: { returnUrl: '/dashboard' } }
    );
  });

  it('should allow access when user has required role', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.hasAnyRole.and.returnValue(true);
    mockRoute.data = { roles: ['admin', 'property_manager'] };

    const result = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );

    expect(result).toBe(true);
    expect(authService.hasAnyRole).toHaveBeenCalledWith(['admin', 'property_manager']);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to unauthorized when user lacks required role', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.hasAnyRole.and.returnValue(false);
    mockRoute.data = { roles: ['admin'] };

    const result = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );

    expect(result).toBe(false);
    expect(authService.hasAnyRole).toHaveBeenCalledWith(['admin']);
    expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('should handle empty roles array', () => {
    authService.isAuthenticated.and.returnValue(true);
    mockRoute.data = { roles: [] };

    const result = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );

    expect(result).toBe(true);
    expect(authService.hasAnyRole).not.toHaveBeenCalled();
  });
});
