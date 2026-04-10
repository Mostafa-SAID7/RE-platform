import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User, UserRole } from '../models/user.model';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    passwordHash: 'hashed',
    name: 'Test User',
    role: 'property_manager',
    permissions: [
      { resource: 'properties', actions: ['read', 'update'] }
    ],
    language: 'en',
    preferences: {
      theme: 'light',
      notifications: {
        email: true,
        inApp: true,
        categories: []
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockLoginResponse = {
    user: mockUser,
    token: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token'
  };

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('login', () => {
    it('should login successfully and store session data', (done) => {
      const credentials = { email: 'test@example.com', password: 'password123' };

      service.login(credentials).subscribe(user => {
        expect(user).toEqual(mockUser);
        expect(service.getToken()).toBe('mock-jwt-token');
        expect(service.getRefreshToken()).toBe('mock-refresh-token');
        expect(service.isAuthenticated()).toBe(true);
        expect(service.getCurrentUser()).toEqual(mockUser);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockLoginResponse);
    });

    it('should handle login failure', (done) => {
      const credentials = { email: 'test@example.com', password: 'wrong' };
      const errorResponse = { status: 401, statusText: 'Unauthorized' };

      service.login(credentials).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(service.isAuthenticated()).toBe(false);
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush('Invalid credentials', errorResponse);
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      // Setup authenticated state
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('refresh_token', 'mock-refresh');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
    });

    it('should logout successfully and clear session', (done) => {
      service.logout().subscribe(() => {
        expect(service.getToken()).toBeNull();
        expect(service.getRefreshToken()).toBeNull();
        expect(service.isAuthenticated()).toBe(false);
        expect(service.getCurrentUser()).toBeNull();
        expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });

    it('should clear session even if API call fails', (done) => {
      service.logout().subscribe(() => {
        expect(service.getToken()).toBeNull();
        expect(service.isAuthenticated()).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
      req.error(new ProgressEvent('error'));
    });
  });

  describe('refreshToken', () => {
    beforeEach(() => {
      localStorage.setItem('refresh_token', 'mock-refresh-token');
    });

    it('should refresh token successfully', (done) => {
      const refreshResponse = {
        token: 'new-jwt-token',
        refreshToken: 'new-refresh-token'
      };

      service.refreshToken().subscribe(token => {
        expect(token).toBe('new-jwt-token');
        expect(service.getToken()).toBe('new-jwt-token');
        expect(service.getRefreshToken()).toBe('new-refresh-token');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refreshToken: 'mock-refresh-token' });
      req.flush(refreshResponse);
    });

    it('should handle refresh failure and clear session', (done) => {
      const errorResponse = { status: 401, statusText: 'Unauthorized' };

      service.refreshToken().subscribe({
        next: () => fail('should have failed'),
        error: () => {
          expect(service.getToken()).toBeNull();
          expect(service.isAuthenticated()).toBe(false);
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
      req.flush('Invalid refresh token', errorResponse);
    });

    it('should fail if no refresh token available', (done) => {
      localStorage.removeItem('refresh_token');

      service.refreshToken().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('No refresh token available');
          done();
        }
      });

      httpMock.expectNone(`${environment.apiUrl}/auth/refresh`);
    });
  });

  describe('role and permission checks', () => {
    beforeEach(() => {
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      localStorage.setItem('auth_token', 'mock-token');
    });

    it('should check if user has specific role', () => {
      expect(service.hasRole('property_manager')).toBe(true);
      expect(service.hasRole('admin')).toBe(false);
    });

    it('should check if user has any of specified roles', () => {
      expect(service.hasAnyRole(['admin', 'property_manager'])).toBe(true);
      expect(service.hasAnyRole(['admin', 'investor'])).toBe(false);
    });

    it('should check if user has permission', () => {
      expect(service.hasPermission('properties', 'read')).toBe(true);
      expect(service.hasPermission('properties', 'update')).toBe(true);
      expect(service.hasPermission('properties', 'delete')).toBe(false);
      expect(service.hasPermission('users', 'read')).toBe(false);
    });

    it('should return false for role checks when not authenticated', () => {
      localStorage.clear();
      expect(service.hasRole('admin')).toBe(false);
      expect(service.hasAnyRole(['admin'])).toBe(false);
      expect(service.hasPermission('properties', 'read')).toBe(false);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token and user exist', () => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      
      // Reinitialize service to pick up localStorage changes
      service = TestBed.inject(AuthService);
      
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when no token', () => {
      localStorage.removeItem('auth_token');
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return false when no user data', () => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.removeItem('user_data');
      
      // Reinitialize service
      service = TestBed.inject(AuthService);
      
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', () => {
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      localStorage.setItem('auth_token', 'mock-token');
      
      // Reinitialize service
      service = TestBed.inject(AuthService);
      
      const user = service.getCurrentUser();
      expect(user).toEqual(mockUser);
    });

    it('should return null when not authenticated', () => {
      const user = service.getCurrentUser();
      expect(user).toBeNull();
    });
  });
});
