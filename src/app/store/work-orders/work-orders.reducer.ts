import { createReducer, on } from '@ngrx/store';
import * as WorkOrderActions from './work-orders.actions';

export interface WorkOrdersState {
  workOrders: any[];
  loading: boolean;
  error: any;
}

export const initialState: WorkOrdersState = {
  workOrders: [],
  loading: false,
  error: null
};

export const workOrdersReducer = createReducer(
  initialState,
  on(WorkOrderActions.loadWorkOrders, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(WorkOrderActions.loadWorkOrdersSuccess, (state, { workOrders }) => ({
    ...state,
    workOrders,
    loading: false
  })),
  on(WorkOrderActions.loadWorkOrdersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(WorkOrderActions.createWorkOrderSuccess, (state, { workOrder }) => ({
    ...state,
    workOrders: [...state.workOrders, workOrder]
  })),
  on(WorkOrderActions.updateWorkOrderSuccess, (state, { workOrder }) => ({
    ...state,
    workOrders: state.workOrders.map(wo => wo.id === workOrder.id ? workOrder : wo)
  })),
  on(WorkOrderActions.deleteWorkOrderSuccess, (state, { id }) => ({
    ...state,
    workOrders: state.workOrders.filter(wo => wo.id !== id)
  }))
);
