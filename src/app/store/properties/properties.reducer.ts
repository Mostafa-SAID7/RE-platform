import { createReducer, on } from '@ngrx/store';
import { Property } from '../../models/property.model';
import * as PropertiesActions from './properties.actions';

export interface PropertiesState {
  items: Property[];
  selectedProperty: Property | null;
  total: number;
  page: number;
  limit: number;
  filters: any;
  isLoading: boolean;
  error: string | null;
}

export const initialPropertiesState: PropertiesState = {
  items: [],
  selectedProperty: null,
  total: 0,
  page: 1,
  limit: 20,
  filters: {},
  isLoading: false,
  error: null
};

export const propertiesReducer = createReducer(
  initialPropertiesState,
  // Load Properties
  on(PropertiesActions.loadProperties, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(PropertiesActions.loadPropertiesSuccess, (state, { properties, total, page, limit }) => ({
    ...state,
    items: properties,
    total,
    page,
    limit,
    isLoading: false,
    error: null
  })),
  on(PropertiesActions.loadPropertiesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Load Single Property
  on(PropertiesActions.loadProperty, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(PropertiesActions.loadPropertySuccess, (state, { property }) => ({
    ...state,
    selectedProperty: property,
    isLoading: false,
    error: null
  })),
  on(PropertiesActions.loadPropertyFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Create Property
  on(PropertiesActions.createProperty, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(PropertiesActions.createPropertySuccess, (state, { property }) => ({
    ...state,
    items: [property, ...state.items],
    total: state.total + 1,
    isLoading: false,
    error: null
  })),
  on(PropertiesActions.createPropertyFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Update Property
  on(PropertiesActions.updateProperty, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(PropertiesActions.updatePropertySuccess, (state, { property }) => ({
    ...state,
    items: state.items.map((p) => (p.id === property.id ? property : p)),
    selectedProperty: state.selectedProperty?.id === property.id ? property : state.selectedProperty,
    isLoading: false,
    error: null
  })),
  on(PropertiesActions.updatePropertyFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Delete Property
  on(PropertiesActions.deleteProperty, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(PropertiesActions.deletePropertySuccess, (state, { id }) => ({
    ...state,
    items: state.items.filter((p) => p.id !== id),
    selectedProperty: state.selectedProperty?.id === id ? null : state.selectedProperty,
    total: state.total - 1,
    isLoading: false,
    error: null
  })),
  on(PropertiesActions.deletePropertyFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Bulk Update Properties
  on(PropertiesActions.bulkUpdateProperties, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(PropertiesActions.bulkUpdatePropertiesSuccess, (state) => ({
    ...state,
    isLoading: false,
    error: null
  })),
  on(PropertiesActions.bulkUpdatePropertiesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Select Property
  on(PropertiesActions.selectProperty, (state, { id }) => ({
    ...state,
    selectedProperty: state.items.find((p) => p.id === id) || null
  })),
  // Clear Selected Property
  on(PropertiesActions.clearSelectedProperty, (state) => ({
    ...state,
    selectedProperty: null
  })),
  // Update Filters
  on(PropertiesActions.updateFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
    page: 1
  })),
  // Clear Filters
  on(PropertiesActions.clearFilters, (state) => ({
    ...state,
    filters: {},
    page: 1
  }))
);
