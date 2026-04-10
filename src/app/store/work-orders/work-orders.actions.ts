import { createAction, props } from '@ngrx/store';

export const loadWorkOrders = createAction(
  '[Work Orders] Load Work Orders'
);

export const loadWorkOrdersSuccess = createAction(
  '[Work Orders] Load Work Orders Success',
  props<{ workOrders: any[] }>()
);

export const loadWorkOrdersFailure = createAction(
  '[Work Orders] Load Work Orders Failure',
  props<{ error: any }>()
);

export const createWorkOrder = createAction(
  '[Work Orders] Create Work Order',
  props<{ workOrder: any }>()
);

export const createWorkOrderSuccess = createAction(
  '[Work Orders] Create Work Order Success',
  props<{ workOrder: any }>()
);

export const createWorkOrderFailure = createAction(
  '[Work Orders] Create Work Order Failure',
  props<{ error: any }>()
);

export const updateWorkOrder = createAction(
  '[Work Orders] Update Work Order',
  props<{ id: string; workOrder: any }>()
);

export const updateWorkOrderSuccess = createAction(
  '[Work Orders] Update Work Order Success',
  props<{ workOrder: any }>()
);

export const updateWorkOrderFailure = createAction(
  '[Work Orders] Update Work Order Failure',
  props<{ error: any }>()
);

export const deleteWorkOrder = createAction(
  '[Work Orders] Delete Work Order',
  props<{ id: string }>()
);

export const deleteWorkOrderSuccess = createAction(
  '[Work Orders] Delete Work Order Success',
  props<{ id: string }>()
);

export const deleteWorkOrderFailure = createAction(
  '[Work Orders] Delete Work Order Failure',
  props<{ error: any }>()
);
