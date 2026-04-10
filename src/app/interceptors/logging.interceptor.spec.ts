import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { loggingInterceptor } from './logging.interceptor';
import { environment } from '../../environments/environment';

describe('loggingInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let consoleLogSpy: jasmine.Spy;
  let consoleErrorSpy: jasmine.Spy;
  let originalProduction: boolean;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loggingInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    
    consoleLogSpy = spyOn(console, 'log').and.stub();
    consoleErrorSpy = spyOn(console, 'error').and.stub();
    
    // Store original production value
    originalProduction = environment.production;
  });

  afterEach(() => {
    httpMock.verify();
    // Restore original production value
    environment.production = originalProduction;
  });

  it('should log successful requests in development mode', () => {
    // Ensure we're in development mode
    (environment as any).production = false;

    httpClient.get('/api/properties').subscribe();

    const req = httpMock.expectOne('/api/properties');
    req.flush({ success: true });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      jasmine.stringContaining('[HTTP] GET /api/properties - Request started')
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      jasmine.stringContaining('[HTTP] GET /api/properties - 200'),
      jasmine.any(Object)
    );
  });

  it('should log error responses in development mode', () => {
    (environment as any).production = false;

    httpClient.get('/api/properties').subscribe({
      next: () => fail('Should error'),
      error: () => {}
    });

    const req = httpMock.expectOne('/api/properties');
    req.flush(null, { status: 404, statusText: 'Not Found' });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      jasmine.stringContaining('[HTTP] GET /api/properties - Request started')
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      jasmine.stringContaining('[HTTP] GET /api/properties - 404'),
      jasmine.any(Object)
    );
  });

  it('should not log in production mode', () => {
    (environment as any).production = true;

    httpClient.get('/api/properties').subscribe();

    const req = httpMock.expectOne('/api/properties');
    req.flush({ success: true });

    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should include request duration in logs', () => {
    (environment as any).production = false;

    httpClient.get('/api/properties').subscribe();

    const req = httpMock.expectOne('/api/properties');
    req.flush({ success: true });

    const logCall = consoleLogSpy.calls.all().find(call => 
      call.args[0].includes('200')
    );
    expect(logCall).toBeDefined();
    expect(logCall?.args[0]).toMatch(/\d+ms/);
  });

  it('should log POST requests', () => {
    (environment as any).production = false;

    httpClient.post('/api/properties', { name: 'Test Property' }).subscribe();

    const req = httpMock.expectOne('/api/properties');
    req.flush({ id: '123' });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      jasmine.stringContaining('[HTTP] POST /api/properties - Request started')
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      jasmine.stringContaining('[HTTP] POST /api/properties - 200'),
      jasmine.any(Object)
    );
  });

  it('should log PUT requests', () => {
    (environment as any).production = false;

    httpClient.put('/api/properties/123', { name: 'Updated Property' }).subscribe();

    const req = httpMock.expectOne('/api/properties/123');
    req.flush({ id: '123' });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      jasmine.stringContaining('[HTTP] PUT /api/properties/123 - Request started')
    );
  });

  it('should log DELETE requests', () => {
    (environment as any).production = false;

    httpClient.delete('/api/properties/123').subscribe();

    const req = httpMock.expectOne('/api/properties/123');
    req.flush({ success: true });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      jasmine.stringContaining('[HTTP] DELETE /api/properties/123 - Request started')
    );
  });
});
