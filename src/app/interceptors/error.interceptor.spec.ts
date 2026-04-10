import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { errorInterceptor } from './error.interceptor';
import { AuthService } from '../services/auth.service';

describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['refreshToken', 'logout']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
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

  it('should handle 401 error by refreshing token', fakeAsync(() => {
    const newToken = 'new-jwt-token';
    authService.refreshToken.and.returnValue(of(newToken));

    httpClient.get('/api/properties').subscribe({
      next: (data) => expect(data).toEqual({ success: true }),
      error: () => fail('Should not error')
    });

    // First request fails with 401
    const req1 = httpMock.expectOne('/api/properties');
    req1.flush(null, { status: 401, statusText: 'Unauthorized' });

    tick();

    // Second request with new token should succeed
    const req2 = httpMock.expectOne('/api/properties');
    expect(req2.request.headers.get('Authorization')).toBe(`Bearer ${newToken}`);
    req2.flush({ success: true });

    tick();
  }));

  it('should logout user if token refresh fails', fakeAsync(() => {
    authService.refreshToken.and.returnValue(throwError(() => new Error('Refresh failed')));
    authService.logout.and.returnValue(of(void 0));

    httpClient.get('/api/properties').subscribe({
      next: () => fail('Should error'),
      error: (error) => expect(error).toBeDefined()
    });

    const req = httpMock.expectOne('/api/properties');
    req.flush(null, { status: 401, statusText: 'Unauthorized' });

    tick();

    expect(authService.logout).toHaveBeenCalled();
  }));

  it('should not attempt token refresh for auth endpoints', fakeAsync(() => {
    httpClient.post('/api/auth/login', {}).subscribe({
      next: () => fail('Should error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(401);
      }
    });

    const req = httpMock.expectOne('/api/auth/login');
    req.flush(null, { status: 401, statusText: 'Unauthorized' });

    tick();

    expect(authService.refreshToken).not.toHaveBeenCalled();
  }));

  it('should retry on network errors (status 0)', fakeAsync(() => {
    let attemptCount = 0;

    httpClient.get('/api/properties').subscribe({
      next: (data) => {
        expect(data).toEqual({ success: true });
        expect(attemptCount).toBeGreaterThan(1);
      },
      error: () => fail('Should not error after retry')
    });

    // Simulate network errors for first 2 attempts
    for (let i = 0; i < 2; i++) {
      tick(1000 * Math.pow(2, i)); // Wait for exponential backoff
      const req = httpMock.expectOne('/api/properties');
      attemptCount++;
      req.error(new ProgressEvent('error'), { status: 0 });
    }

    // Third attempt succeeds
    tick(4000);
    const req = httpMock.expectOne('/api/properties');
    attemptCount++;
    req.flush({ success: true });

    tick();
  }));

  it('should retry on server errors (5xx)', fakeAsync(() => {
    let attemptCount = 0;

    httpClient.get('/api/properties').subscribe({
      next: (data) => {
        expect(data).toEqual({ success: true });
        expect(attemptCount).toBeGreaterThan(1);
      },
      error: () => fail('Should not error after retry')
    });

    // Simulate server errors for first 2 attempts
    for (let i = 0; i < 2; i++) {
      tick(1000 * Math.pow(2, i));
      const req = httpMock.expectOne('/api/properties');
      attemptCount++;
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    }

    // Third attempt succeeds
    tick(4000);
    const req = httpMock.expectOne('/api/properties');
    attemptCount++;
    req.flush({ success: true });

    tick();
  }));

  it('should not retry on client errors (4xx except 401)', fakeAsync(() => {
    httpClient.get('/api/properties').subscribe({
      next: () => fail('Should error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne('/api/properties');
    req.flush(null, { status: 404, statusText: 'Not Found' });

    tick();

    // Should not retry, so no additional requests
    httpMock.expectNone('/api/properties');
  }));

  it('should pass through successful responses', () => {
    httpClient.get('/api/properties').subscribe({
      next: (data) => expect(data).toEqual({ success: true }),
      error: () => fail('Should not error')
    });

    const req = httpMock.expectOne('/api/properties');
    req.flush({ success: true });
  });
});
