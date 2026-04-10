import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'properties',
    loadComponent: () => import('./features/property-listing/property-listing.component').then(m => m.PropertyListingComponent),
    canActivate: [authGuard]
  },
  {
    path: 'properties/:id',
    loadComponent: () => import('./features/property-detail/property-detail.component').then(m => m.PropertyDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'map',
    loadComponent: () => import('./features/map/map.component').then(m => m.MapComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tenants',
    loadComponent: () => import('./features/tenant-management/tenant-management.component').then(m => m.TenantManagementComponent),
    canActivate: [authGuard]
  },
  {
    path: 'financial-analytics',
    loadComponent: () => import('./features/financial-analytics/financial-analytics.component').then(m => m.FinancialAnalyticsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'work-orders',
    loadComponent: () => import('./features/work-order/work-order.component').then(m => m.WorkOrderComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reporting',
    loadComponent: () => import('./features/reporting/reporting.component').then(m => m.ReportingComponent),
    canActivate: [authGuard]
  },
  {
    path: 'notifications',
    loadComponent: () => import('./features/notifications/notification-center.component').then(m => m.NotificationCenterComponent),
    canActivate: [authGuard]
  }
];
