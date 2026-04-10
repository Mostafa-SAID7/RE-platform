import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse): void {
    const notificationService = this.injector.get(NotificationService);
    let message = 'An unexpected error occurred';

    if (error instanceof HttpErrorResponse) {
      // Handle HTTP errors
      switch (error.status) {
        case 401:
          message = 'Unauthorized. Please log in again.';
          break;
        case 403:
          message = 'You do not have permission to perform this action.';
          break;
        case 404:
          message = 'The requested resource was not found.';
          break;
        case 422:
          message = 'Validation error. Please check your input.';
          break;
        case 429:
          message = 'Too many requests. Please try again later.';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          message = 'Server error. Please try again later.';
          break;
        default:
          message = error.message || 'An error occurred';
      }
    } else if (error instanceof Error) {
      // Handle client-side errors
      message = error.message || 'An unexpected error occurred';
    }

    // Log error
    console.error('Error:', error);

    // Show notification
    notificationService.showError(message);
  }
}
