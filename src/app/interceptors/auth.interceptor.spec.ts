import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should attach Authorization header when token exists', () => {
    const mockToken = 'test-jwt-token';
    authService.getToken.and.returnValue(mockToken);

    httpClient.get('/api/properties').subscribe();

    const req = httpMock.expectOne('/api/properties');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush({});
  });

  it('should not attach Authorization header when token is null', () => {
    authService.getToken.and.returnValue(null);

    httpClient.get('/api/properties').subscribe();

    const req = httpMock.expectOne('/api/properties');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should skip authentication for login endpoint', () => {
    authService.getToken.and.returnValue('test-token');

    httpClient.post('/api/auth/login', { email: 'test@test.com', password: 'pass' }).subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should skip authentication for register endpoint', () => {
    authService.getToken.and.returnValue('test-token');

    httpClient.post('/api/auth/register', { email: 'test@test.com' }).subscribe();

    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should skip authentication for forgot-password endpoint', () => {
    authService.getToken.and.returnValue('test-token');

    httpClient.post('/api/auth/forgot-password', { email: 'test@test.com' }).subscribe();

    const req = httpMock.expectOne('/api/auth/forgot-password');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should skip authentication for reset-password endpoint', () => {
    authService.getToken.and.returnValue('test-token');

    httpClient.post('/api/auth/reset-password', { token: 'reset-token', password: 'new-pass' }).subscribe();

    const req = httpMock.expectOne('/api/auth/reset-password');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
