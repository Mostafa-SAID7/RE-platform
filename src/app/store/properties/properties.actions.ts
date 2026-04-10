import { createAction, props } from '@ngrx/store';
import { Property } from '../../models/property.model';

// Load Properties
export const loadProperties = createAction(
  '[Properties] Load Properties',
  props<{ page?: number; limit?: number; filters?: any }>()
);

export const loadPropertiesSuccess = createAction(
  '[Properties] Load Properties Success',
  props<{ properties: Property[]; total: number; page: number; limit: number }>()
);

export const loadPropertiesFailure = createAction(
  '[Properties] Load Properties Failure',
  props<{ error: string }>()
);

// Load Single Property
export const loadProperty = createAction(
  '[Properties] Load Property',
  props<{ id: string }>()
);

export const loadPropertySuccess = createAction(
  '[Properties] Load Property Success',
  props<{ property: Property }>()
);

export const loadPropertyFailure = createAction(
  '[Properties] Load Property Failure',
  props<{ error: string }>()
);

// Create Property
export const createProperty = createAction(
  '[Properties] Create Property',
  props<{ property: Partial<Property> }>()
);

export const createPropertySuccess = createAction(
  '[Properties] Create Property Success',
  props<{ property: Property }>()
);

export const createPropertyFailure = createAction(
  '[Properties] Create Property Failure',
  props<{ error: string }>()
);

// Update Property
export const updateProperty = createAction(
  '[Properties] Update Property',
  props<{ id: string; property: Partial<Property> }>()
);

export const updatePropertySuccess = createAction(
  '[Properties] Update Property Success',
  props<{ property: Property }>()
);

export const updatePropertyFailure = createAction(
  '[Properties] Update Property Failure',
  props<{ error: string }>()
);

// Delete Property
export const deleteProperty = createAction(
  '[Properties] Delete Property',
  props<{ id: string }>()
);

export const deletePropertySuccess = createAction(
  '[Properties] Delete Property Success',
  props<{ id: string }>()
);

export const deletePropertyFailure = createAction(
  '[Properties] Delete Property Failure',
  props<{ error: string }>()
);

// Bulk Update Properties
export const bulkUpdateProperties = createAction(
  '[Properties] Bulk Update Properties',
  props<{ propertyIds: string[]; updates: Partial<Property> }>()
);

export const bulkUpdatePropertiesSuccess = createAction(
  '[Properties] Bulk Update Properties Success',
  props<{ updated: number }>()
);

export const bulkUpdatePropertiesFailure = createAction(
  '[Properties] Bulk Update Properties Failure',
  props<{ error: string }>()
);

// Select Property
export const selectProperty = createAction(
  '[Properties] Select Property',
  props<{ id: string }>()
);

// Clear Selected Property
export const clearSelectedProperty = createAction(
  '[Properties] Clear Selected Property'
);

// Update Filters
export const updateFilters = createAction(
  '[Properties] Update Filters',
  props<{ filters: any }>()
);

// Clear Filters
export const clearFilters = createAction('[Properties] Clear Filters');
