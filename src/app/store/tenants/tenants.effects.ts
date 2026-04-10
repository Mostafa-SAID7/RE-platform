import { Injectable, Inject, Optional } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { Tenant } from '../../models/tenant.model';
import * as TenantsActions from './tenants.actions';

// Placeholder service token - will be implemented in task 4.1
export const TENANT_SERVICE = 'TenantService';

@Injectable()
export class TenantsEffects {
  loadTenants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TenantsActions.loadTenants),
      switchMap(({ page = 1, limit = 20, filters = {} }): Observable<Action> => {
        if (!this.tenantService) {
          return of(TenantsActions.loadTenantsFailure({ error: 'TenantService not provided' }));
        }
        return this.tenantService.getTenants(page, limit, filters).pipe(
          map(({ data, total }: any) =>
            TenantsActions.loadTenantsSuccess({
              tenants: data,
              total,
              page,
              limit
            })
          ),
          catchError((error: any) =>
            of(TenantsActions.loadTenantsFailure({ error: error.message }))
          )
        );
      })
    ),
    { dispatch: true }
  );

  loadTenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TenantsActions.loadTenant),
      switchMap(({ id }): Observable<Action> => {
        if (!this.tenantService) {
          return of(TenantsActions.loadTenantFailure({ error: 'TenantService not provided' }));
        }
        return this.tenantService.getTenant(id).pipe(
          map((tenant: Tenant) =>
            TenantsActions.loadTenantSuccess({ tenant })
          ),
          catchError((error: any) =>
            of(TenantsActions.loadTenantFailure({ error: error.message }))
          )
        );
      })
    ),
    { dispatch: true }
  );

  createTenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TenantsActions.createTenant),
      switchMap(({ tenant }): Observable<Action> => {
        if (!this.tenantService) {
          return of(TenantsActions.createTenantFailure({ error: 'TenantService not provided' }));
        }
        return this.tenantService.createTenant(tenant).pipe(
          map((createdTenant: Tenant) =>
            TenantsActions.createTenantSuccess({ tenant: createdTenant })
          ),
          catchError((error: any) =>
            of(TenantsActions.createTenantFailure({ error: error.message }))
          )
        );
      })
    ),
    { dispatch: true }
  );

  updateTenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TenantsActions.updateTenant),
      switchMap(({ id, tenant }): Observable<Action> => {
        if (!this.tenantService) {
          return of(TenantsActions.updateTenantFailure({ error: 'TenantService not provided' }));
        }
        return this.tenantService.updateTenant(id, tenant).pipe(
          map((updatedTenant: Tenant) =>
            TenantsActions.updateTenantSuccess({ tenant: updatedTenant })
          ),
          catchError((error: any) =>
            of(TenantsActions.updateTenantFailure({ error: error.message }))
          )
        );
      })
    ),
    { dispatch: true }
  );

  deleteTenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TenantsActions.deleteTenant),
      switchMap(({ id }): Observable<Action> => {
        if (!this.tenantService) {
          return of(TenantsActions.deleteTenantFailure({ error: 'TenantService not provided' }));
        }
        return this.tenantService.deleteTenant(id).pipe(
          map(() =>
            TenantsActions.deleteTenantSuccess({ id })
          ),
          catchError((error: any) =>
            of(TenantsActions.deleteTenantFailure({ error: error.message }))
          )
        );
      })
    ),
    { dispatch: true }
  );

  constructor(
    private actions$: Actions,
    @Optional() @Inject(TENANT_SERVICE) private tenantService?: any
  ) {}
}
