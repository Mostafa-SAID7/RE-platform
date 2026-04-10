import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TenantsState } from './tenants.reducer';

export const selectTenantsState = createFeatureSelector<TenantsState>('tenants');

export const selectAllTenants = createSelector(
  selectTenantsState,
  (state: TenantsState) => state.items
);

export const selectSelectedTenant = createSelector(
  selectTenantsState,
  (state: TenantsState) => state.selectedTenant
);

export const selectTenantsTotal = createSelector(
  selectTenantsState,
  (state: TenantsState) => state.total
);

export const selectTenantsPage = createSelector(
  selectTenantsState,
  (state: TenantsState) => state.page
);

export const selectTenantsLimit = createSelector(
  selectTenantsState,
  (state: TenantsState) => state.limit
);

export const selectTenantsFilters = createSelector(
  selectTenantsState,
  (state: TenantsState) => state.filters
);

export const selectTenantsIsLoading = createSelector(
  selectTenantsState,
  (state: TenantsState) => state.isLoading
);

export const selectTenantsError = createSelector(
  selectTenantsState,
  (state: TenantsState) => state.error
);

export const selectTenantById = (id: string) =>
  createSelector(
    selectAllTenants,
    (tenants) => tenants.find((t) => t.id === id) || null
  );

export const selectTenantsByName = (name: string) =>
  createSelector(
    selectAllTenants,
    (tenants) =>
      tenants.filter((t) =>
        t.name.toLowerCase().includes(name.toLowerCase())
      )
  );

export const selectTenantsCount = createSelector(
  selectAllTenants,
  (tenants) => tenants.length
);
