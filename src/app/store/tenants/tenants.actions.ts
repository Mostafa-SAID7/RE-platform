import { createAction, props } from '@ngrx/store';
import { Tenant } from '../../models/tenant.model';

// Load Tenants
export const loadTenants = createAction(
  '[Tenants] Load Tenants',
  props<{ page?: number; limit?: number; filters?: any }>()
);

export const loadTenantsSuccess = createAction(
  '[Tenants] Load Tenants Success',
  props<{ tenants: Tenant[]; total: number; page: number; limit: number }>()
);

export const loadTenantsFailure = createAction(
  '[Tenants] Load Tenants Failure',
  props<{ error: string }>()
);

// Load Single Tenant
export const loadTenant = createAction(
  '[Tenants] Load Tenant',
  props<{ id: string }>()
);

export const loadTenantSuccess = createAction(
  '[Tenants] Load Tenant Success',
  props<{ tenant: Tenant }>()
);

export const loadTenantFailure = createAction(
  '[Tenants] Load Tenant Failure',
  props<{ error: string }>()
);

// Create Tenant
export const createTenant = createAction(
  '[Tenants] Create Tenant',
  props<{ tenant: Partial<Tenant> }>()
);

export const createTenantSuccess = createAction(
  '[Tenants] Create Tenant Success',
  props<{ tenant: Tenant }>()
);

export const createTenantFailure = createAction(
  '[Tenants] Create Tenant Failure',
  props<{ error: string }>()
);

// Update Tenant
export const updateTenant = createAction(
  '[Tenants] Update Tenant',
  props<{ id: string; tenant: Partial<Tenant> }>()
);

export const updateTenantSuccess = createAction(
  '[Tenants] Update Tenant Success',
  props<{ tenant: Tenant }>()
);

export const updateTenantFailure = createAction(
  '[Tenants] Update Tenant Failure',
  props<{ error: string }>()
);

// Delete Tenant
export const deleteTenant = createAction(
  '[Tenants] Delete Tenant',
  props<{ id: string }>()
);

export const deleteTenantSuccess = createAction(
  '[Tenants] Delete Tenant Success',
  props<{ id: string }>()
);

export const deleteTenantFailure = createAction(
  '[Tenants] Delete Tenant Failure',
  props<{ error: string }>()
);

// Select Tenant
export const selectTenant = createAction(
  '[Tenants] Select Tenant',
  props<{ id: string }>()
);

// Clear Selected Tenant
export const clearSelectedTenant = createAction(
  '[Tenants] Clear Selected Tenant'
);

// Update Filters
export const updateFilters = createAction(
  '[Tenants] Update Filters',
  props<{ filters: any }>()
);

// Clear Filters
export const clearFilters = createAction('[Tenants] Clear Filters');
