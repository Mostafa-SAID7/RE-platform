import { Injectable } from '@angular/core';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logLevel = LogLevel.INFO;

  constructor() {
    // Set log level based on environment
    const isDevelopment = !this.isProduction();
    this.logLevel = isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  }

  debug(message: string, data?: any): void {
    if (this.logLevel <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  info(message: string, data?: any): void {
    if (this.logLevel <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, data);
    }
  }

  warn(message: string, data?: any): void {
    if (this.logLevel <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, data);
    }
  }

  error(message: string, error?: any): void {
    if (this.logLevel <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, error);
      this.sendErrorToBackend(message, error);
    }
  }

  private sendErrorToBackend(message: string, error: any): void {
    // Send critical errors to backend for monitoring
    const errorData = {
      message,
      error: error?.message || String(error),
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // In a real application, this would send to a logging service
    console.log('Error sent to backend:', errorData);
  }

  private isProduction(): boolean {
    return !window.location.hostname.includes('localhost');
  }
}
