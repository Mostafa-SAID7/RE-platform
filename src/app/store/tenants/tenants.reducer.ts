import { createReducer, on } from '@ngrx/store';
import { Tenant } from '../../models/tenant.model';
import * as TenantsActions from './tenants.actions';

export interface TenantsState {
  items: Tenant[];
  selectedTenant: Tenant | null;
  total: number;
  page: number;
  limit: number;
  filters: any;
  isLoading: boolean;
  error: string | null;
}

export const initialTenantsState: TenantsState = {
  items: [],
  selectedTenant: null,
  total: 0,
  page: 1,
  limit: 20,
  filters: {},
  isLoading: false,
  error: null
};

export const tenantsReducer = createReducer(
  initialTenantsState,
  // Load Tenants
  on(TenantsActions.loadTenants, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(TenantsActions.loadTenantsSuccess, (state, { tenants, total, page, limit }) => ({
    ...state,
    items: tenants,
    total,
    page,
    limit,
    isLoading: false,
    error: null
  })),
  on(TenantsActions.loadTenantsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Load Single Tenant
  on(TenantsActions.loadTenant, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(TenantsActions.loadTenantSuccess, (state, { tenant }) => ({
    ...state,
    selectedTenant: tenant,
    isLoading: false,
    error: null
  })),
  on(TenantsActions.loadTenantFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Create Tenant
  on(TenantsActions.createTenant, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(TenantsActions.createTenantSuccess, (state, { tenant }) => ({
    ...state,
    items: [tenant, ...state.items],
    total: state.total + 1,
    isLoading: false,
    error: null
  })),
  on(TenantsActions.createTenantFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Update Tenant
  on(TenantsActions.updateTenant, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(TenantsActions.updateTenantSuccess, (state, { tenant }) => ({
    ...state,
    items: state.items.map((t) => (t.id === tenant.id ? tenant : t)),
    selectedTenant: state.selectedTenant?.id === tenant.id ? tenant : state.selectedTenant,
    isLoading: false,
    error: null
  })),
  on(TenantsActions.updateTenantFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Delete Tenant
  on(TenantsActions.deleteTenant, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(TenantsActions.deleteTenantSuccess, (state, { id }) => ({
    ...state,
    items: state.items.filter((t) => t.id !== id),
    selectedTenant: state.selectedTenant?.id === id ? null : state.selectedTenant,
    total: state.total - 1,
    isLoading: false,
    error: null
  })),
  on(TenantsActions.deleteTenantFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Select Tenant
  on(TenantsActions.selectTenant, (state, { id }) => ({
    ...state,
    selectedTenant: state.items.find((t) => t.id === id) || null
  })),
  // Clear Selected Tenant
  on(TenantsActions.clearSelectedTenant, (state) => ({
    ...state,
    selectedTenant: null
  })),
  // Update Filters
  on(TenantsActions.updateFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
    page: 1
  })),
  // Clear Filters
  on(TenantsActions.clearFilters, (state) => ({
    ...state,
    filters: {},
    page: 1
  }))
);
