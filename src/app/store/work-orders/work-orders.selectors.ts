import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WorkOrdersState } from './work-orders.reducer';

export const selectWorkOrdersState = createFeatureSelector<WorkOrdersState>('workOrders');

export const selectWorkOrders = createSelector(
  selectWorkOrdersState,
  (state: WorkOrdersState) => state.workOrders
);

export const selectWorkOrdersLoading = createSelector(
  selectWorkOrdersState,
  (state: WorkOrdersState) => state.loading
);

export const selectWorkOrdersError = createSelector(
  selectWorkOrdersState,
  (state: WorkOrdersState) => state.error
);

export const selectWorkOrderById = (id: string) => createSelector(
  selectWorkOrders,
  (workOrders: any[]) => workOrders.find(wo => wo.id === id)
);
