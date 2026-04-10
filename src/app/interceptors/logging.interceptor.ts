import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * HTTP Interceptor that logs request and response information
 * 
 * This interceptor:
 * - Logs request method, URL, and timing
 * - Logs response status and duration
 * - Logs errors with status codes
 * - Only logs in development mode
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  // Only log in development mode
  if (environment.production) {
    return next(req);
  }
  
  const startTime = Date.now();
  const method = req.method;
  const url = req.url;
  
  console.log(`[HTTP] ${method} ${url} - Request started`);
  
  return next(req).pipe(
    tap({
      next: (event) => {
        // Log successful responses
        if (event instanceof HttpResponse) {
          const duration = Date.now() - startTime;
          const status = event.status;
          
          console.log(
            `[HTTP] ${method} ${url} - ${status} (${duration}ms)`,
            {
              status,
              duration,
              body: event.body
            }
          );
        }
      },
      error: (error: HttpErrorResponse) => {
        // Log error responses
        const duration = Date.now() - startTime;
        const status = error.status;
        
        console.error(
          `[HTTP] ${method} ${url} - ${status} (${duration}ms)`,
          {
            status,
            duration,
            message: error.message,
            error: error.error
          }
        );
      }
    })
  );
};
