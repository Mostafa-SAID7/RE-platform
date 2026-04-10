import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { adminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';

describe('adminGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['hasRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access when user has admin role', () => {
    authService.hasRole.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => adminGuard());

    expect(result).toBe(true);
    expect(authService.hasRole).toHaveBeenCalledWith('admin');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to unauthorized when user is not admin', () => {
    authService.hasRole.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => adminGuard());

    expect(result).toBe(false);
    expect(authService.hasRole).toHaveBeenCalledWith('admin');
    expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });
});
