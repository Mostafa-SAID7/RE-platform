import { Injectable, Inject, Optional } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import * as FinancialsActions from './financials.actions';

// Placeholder service token - will be implemented in task 4.1
export const FINANCIAL_SERVICE = 'FinancialService';

@Injectable()
export class FinancialsEffects {
  loadFinancialSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinancialsActions.loadFinancialSummary),
      switchMap(({ startDate, endDate, propertyIds }): Observable<Action> => {
        if (!this.financialService) {
          return of(FinancialsActions.loadFinancialSummaryFailure({ error: 'FinancialService not provided' }));
        }
        return this.financialService.getFinancialSummary(startDate, endDate, propertyIds).pipe(
          map((summary: any) =>
            FinancialsActions.loadFinancialSummarySuccess({ summary })
          ),
          catchError((error: any) =>
            of(FinancialsActions.loadFinancialSummaryFailure({ error: error.message }))
          )
        );
      })
    )
  );

  loadRevenueBreakdown$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinancialsActions.loadRevenueBreakdown),
      switchMap(({ startDate, endDate, groupBy }): Observable<Action> => {
        if (!this.financialService) {
          return of(FinancialsActions.loadRevenueBreakdownFailure({ error: 'FinancialService not provided' }));
        }
        return this.financialService.getRevenueBreakdown(startDate, endDate, groupBy).pipe(
          map((breakdown: any) =>
            FinancialsActions.loadRevenueBreakdownSuccess({ breakdown })
          ),
          catchError((error: any) =>
            of(FinancialsActions.loadRevenueBreakdownFailure({ error: error.message }))
          )
        );
      })
    )
  );

  loadExpenseBreakdown$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinancialsActions.loadExpenseBreakdown),
      switchMap(({ startDate, endDate, groupBy }): Observable<Action> => {
        if (!this.financialService) {
          return of(FinancialsActions.loadExpenseBreakdownFailure({ error: 'FinancialService not provided' }));
        }
        return this.financialService.getExpenseBreakdown(startDate, endDate, groupBy).pipe(
          map((breakdown: any) =>
            FinancialsActions.loadExpenseBreakdownSuccess({ breakdown })
          ),
          catchError((error: any) =>
            of(FinancialsActions.loadExpenseBreakdownFailure({ error: error.message }))
          )
        );
      })
    )
  );

  loadCashFlow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinancialsActions.loadCashFlow),
      switchMap(({ startDate, endDate, interval }): Observable<Action> => {
        if (!this.financialService) {
          return of(FinancialsActions.loadCashFlowFailure({ error: 'FinancialService not provided' }));
        }
        return this.financialService.getCashFlow(startDate, endDate, interval).pipe(
          map((cashFlow: any) =>
            FinancialsActions.loadCashFlowSuccess({ cashFlow })
          ),
          catchError((error: any) =>
            of(FinancialsActions.loadCashFlowFailure({ error: error.message }))
          )
        );
      })
    )
  );

  loadRoiData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinancialsActions.loadRoiData),
      switchMap(({ propertyIds }): Observable<Action> => {
        if (!this.financialService) {
          return of(FinancialsActions.loadRoiDataFailure({ error: 'FinancialService not provided' }));
        }
        return this.financialService.getRoiData(propertyIds).pipe(
          map((roiData: any) =>
            FinancialsActions.loadRoiDataSuccess({ roiData })
          ),
          catchError((error: any) =>
            of(FinancialsActions.loadRoiDataFailure({ error: error.message }))
          )
        );
      })
    )
  );

  loadProjections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinancialsActions.loadProjections),
      switchMap(({ months }): Observable<Action> => {
        if (!this.financialService) {
          return of(FinancialsActions.loadProjectionsFailure({ error: 'FinancialService not provided' }));
        }
        return this.financialService.getProjections(months).pipe(
          map((projections: any) =>
            FinancialsActions.loadProjectionsSuccess({ projections })
          ),
          catchError((error: any) =>
            of(FinancialsActions.loadProjectionsFailure({ error: error.message }))
          )
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    @Optional() @Inject(FINANCIAL_SERVICE) private financialService?: any
  ) {}
}
