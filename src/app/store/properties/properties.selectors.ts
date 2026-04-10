import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PropertiesState } from './properties.reducer';

export const selectPropertiesState = createFeatureSelector<PropertiesState>('properties');

export const selectAllProperties = createSelector(
  selectPropertiesState,
  (state: PropertiesState) => state.items
);

export const selectSelectedProperty = createSelector(
  selectPropertiesState,
  (state: PropertiesState) => state.selectedProperty
);

export const selectPropertiesTotal = createSelector(
  selectPropertiesState,
  (state: PropertiesState) => state.total
);

export const selectPropertiesPage = createSelector(
  selectPropertiesState,
  (state: PropertiesState) => state.page
);

export const selectPropertiesLimit = createSelector(
  selectPropertiesState,
  (state: PropertiesState) => state.limit
);

export const selectPropertiesFilters = createSelector(
  selectPropertiesState,
  (state: PropertiesState) => state.filters
);

export const selectPropertiesIsLoading = createSelector(
  selectPropertiesState,
  (state: PropertiesState) => state.isLoading
);

export const selectPropertiesError = createSelector(
  selectPropertiesState,
  (state: PropertiesState) => state.error
);

export const selectPropertyById = (id: string) =>
  createSelector(
    selectAllProperties,
    (properties) => properties.find((p) => p.id === id) || null
  );

export const selectPropertiesByStatus = (status: string) =>
  createSelector(
    selectAllProperties,
    (properties) => properties.filter((p) => p.status === status)
  );

export const selectPropertiesByType = (type: string) =>
  createSelector(
    selectAllProperties,
    (properties) => properties.filter((p) => p.type === type)
  );

export const selectPropertiesCount = createSelector(
  selectAllProperties,
  (properties) => properties.length
);

export const selectAverageOccupancyRate = createSelector(
  selectAllProperties,
  (properties) => {
    if (properties.length === 0) return 0;
    const total = properties.reduce((sum, p) => sum + p.occupancyRate, 0);
    return total / properties.length;
  }
);

export const selectTotalRevenue = createSelector(
  selectAllProperties,
  (properties) =>
    properties.reduce((sum, p) => sum + (p.monthlyRevenue || 0), 0)
);

export const selectAverageRoi = createSelector(
  selectAllProperties,
  (properties) => {
    if (properties.length === 0) return 0;
    const total = properties.reduce((sum, p) => sum + (p.roi || 0), 0);
    return total / properties.length;
  }
);
