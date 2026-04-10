import { ApplicationConfig, provideZoneChangeDetection, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { routes } from './app.routes';
import { authInterceptor, errorInterceptor, loggingInterceptor } from './interceptors';
import { mockHttpInterceptor } from './interceptors/mock-http.interceptor';
import {
  AuthStore,
  PropertiesStore,
  TenantsStore,
  FinancialsStore,
  UIStore,
  NotificationsStore,
  WorkOrdersStore
} from './store';
import { GlobalErrorHandler } from './core/error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    provideHttpClient(
      withInterceptors([
        mockHttpInterceptor,  // Mock HTTP responses for development
        loggingInterceptor,   // Log first to capture all requests
        authInterceptor,      // Add auth token
        errorInterceptor      // Handle errors and retry
      ])
    ),
    provideStore({
      auth: AuthStore.authReducer,
      properties: PropertiesStore.propertiesReducer,
      tenants: TenantsStore.tenantsReducer,
      financials: FinancialsStore.financialsReducer,
      ui: UIStore.uiReducer,
      notifications: NotificationsStore.notificationsReducer,
      workOrders: WorkOrdersStore.workOrdersReducer
    }),
    provideEffects([
      AuthStore.AuthEffects,
      PropertiesStore.PropertiesEffects,
      TenantsStore.TenantsEffects,
      FinancialsStore.FinancialsEffects,
      NotificationsStore.NotificationsEffects,
      WorkOrdersStore.WorkOrdersEffects
    ]),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};
