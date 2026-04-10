import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { WorkOrderService } from '../../services/work-order.service';
import * as WorkOrderActions from './work-orders.actions';

@Injectable()
export class WorkOrdersEffects {
  private actions$ = inject(Actions);
  private workOrderService = inject(WorkOrderService);

  loadWorkOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkOrderActions.loadWorkOrders),
      switchMap(() =>
        this.workOrderService.getWorkOrders().pipe(
          map(response => WorkOrderActions.loadWorkOrdersSuccess({ workOrders: response.data })),
          catchError(error => of(WorkOrderActions.loadWorkOrdersFailure({ error })))
        )
      )
    )
  );

  createWorkOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkOrderActions.createWorkOrder),
      switchMap(({ workOrder }) =>
        this.workOrderService.createWorkOrder(workOrder).pipe(
          map(createdWorkOrder => WorkOrderActions.createWorkOrderSuccess({ workOrder: createdWorkOrder })),
          catchError(error => of(WorkOrderActions.createWorkOrderFailure({ error })))
        )
      )
    )
  );

  updateWorkOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkOrderActions.updateWorkOrder),
      switchMap(({ id, workOrder }) =>
        this.workOrderService.updateWorkOrder(id, workOrder).pipe(
          map(updatedWorkOrder => WorkOrderActions.updateWorkOrderSuccess({ workOrder: updatedWorkOrder })),
          catchError(error => of(WorkOrderActions.updateWorkOrderFailure({ error })))
        )
      )
    )
  );

  deleteWorkOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkOrderActions.deleteWorkOrder),
      switchMap(({ id }) =>
        this.workOrderService.deleteWorkOrder(id).pipe(
          map(() => WorkOrderActions.deleteWorkOrderSuccess({ id })),
          catchError(error => of(WorkOrderActions.deleteWorkOrderFailure({ error })))
        )
      )
    )
  );
}
