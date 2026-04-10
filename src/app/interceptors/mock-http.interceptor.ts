import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Mock HTTP Interceptor that serves local JSON files as API responses
 * This allows development and testing without a real backend
 */
export const mockHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);

  // Map API endpoints to local JSON files
  const mockDataMap: { [key: string]: string } = {
    '/api/properties': 'assets/data/properties.json',
    '/api/tenants': 'assets/data/tenants.json',
    '/api/financials': 'assets/data/financials.json',
    '/api/work-orders': 'assets/data/work-orders.json',
    '/api/notifications': 'assets/data/notifications.json',
    '/api/dashboard': 'assets/data/dashboard.json',
  };

  // Check if this is a GET request to a mocked endpoint
  if (req.method === 'GET') {
    for (const [endpoint, filePath] of Object.entries(mockDataMap)) {
      if (req.url.includes(endpoint)) {
        // Fetch the mock data file using HttpClient
        return new Observable(observer => {
          http.get<any>(filePath).subscribe({
            next: (data) => {
              setTimeout(() => {
                observer.next(
                  new HttpResponse({
                    status: 200,
                    body: data,
                    url: req.url
                  })
                );
                observer.complete();
              }, 300); // 300ms delay to simulate network
            },
            error: () => {
              // If file not found, pass through to real API
              next(req).subscribe(observer);
            }
          });
        });
      }
    }
  }

  // For POST requests, return mock success responses
  if (req.method === 'POST') {
    const mockResponse = {
      success: true,
      data: {
        id: 'mock-' + Date.now(),
        createdDate: new Date().toISOString()
      },
      message: 'Resource created successfully'
    };

    return new Observable(observer => {
      setTimeout(() => {
        observer.next(
          new HttpResponse({
            status: 201,
            body: mockResponse,
            url: req.url
          })
        );
        observer.complete();
      }, 300);
    });
  }

  // For PUT requests, return mock success responses
  if (req.method === 'PUT') {
    const mockResponse = {
      success: true,
      data: {
        updatedDate: new Date().toISOString()
      },
      message: 'Resource updated successfully'
    };

    return new Observable(observer => {
      setTimeout(() => {
        observer.next(
          new HttpResponse({
            status: 200,
            body: mockResponse,
            url: req.url
          })
        );
        observer.complete();
      }, 300);
    });
  }

  // For DELETE requests, return mock success responses
  if (req.method === 'DELETE') {
    const mockResponse = {
      success: true,
      message: 'Resource deleted successfully'
    };

    return new Observable(observer => {
      setTimeout(() => {
        observer.next(
          new HttpResponse({
            status: 200,
            body: mockResponse,
            url: req.url
          })
        );
        observer.complete();
      }, 300);
    });
  }

  // For all other requests, pass through to the real API
  return next(req);
};
