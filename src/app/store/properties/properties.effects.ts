import { Injectable, Inject, Optional } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { Property } from '../../models/property.model';
import * as PropertiesActions from './properties.actions';

// Placeholder service token - will be implemented in task 4.1
export const PROPERTY_SERVICE = 'PropertyService';

@Injectable()
export class PropertiesEffects {
  loadProperties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.loadProperties),
      switchMap(({ page = 1, limit = 20, filters = {} }): Observable<Action> => {
        if (!this.propertyService) {
          return of(PropertiesActions.loadPropertiesFailure({ error: 'PropertyService not provided' }));
        }
        return this.propertyService.getProperties(page, limit, filters).pipe(
          map(({ data, total }: any) =>
            PropertiesActions.loadPropertiesSuccess({
              properties: data,
              total,
              page,
              limit
            })
          ),
          catchError((error: any) =>
            of(PropertiesActions.loadPropertiesFailure({ error: error.message }))
          )
        );
      })
    )
  );

  loadProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.loadProperty),
      switchMap(({ id }): Observable<Action> => {
        if (!this.propertyService) {
          return of(PropertiesActions.loadPropertyFailure({ error: 'PropertyService not provided' }));
        }
        return this.propertyService.getProperty(id).pipe(
          map((property: Property) =>
            PropertiesActions.loadPropertySuccess({ property })
          ),
          catchError((error: any) =>
            of(PropertiesActions.loadPropertyFailure({ error: error.message }))
          )
        );
      })
    )
  );

  createProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.createProperty),
      switchMap(({ property }): Observable<Action> => {
        if (!this.propertyService) {
          return of(PropertiesActions.createPropertyFailure({ error: 'PropertyService not provided' }));
        }
        return this.propertyService.createProperty(property).pipe(
          map((createdProperty: Property) =>
            PropertiesActions.createPropertySuccess({ property: createdProperty })
          ),
          catchError((error: any) =>
            of(PropertiesActions.createPropertyFailure({ error: error.message }))
          )
        );
      })
    )
  );

  updateProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.updateProperty),
      switchMap(({ id, property }): Observable<Action> => {
        if (!this.propertyService) {
          return of(PropertiesActions.updatePropertyFailure({ error: 'PropertyService not provided' }));
        }
        return this.propertyService.updateProperty(id, property).pipe(
          map((updatedProperty: Property) =>
            PropertiesActions.updatePropertySuccess({ property: updatedProperty })
          ),
          catchError((error: any) =>
            of(PropertiesActions.updatePropertyFailure({ error: error.message }))
          )
        );
      })
    )
  );

  deleteProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.deleteProperty),
      switchMap(({ id }): Observable<Action> => {
        if (!this.propertyService) {
          return of(PropertiesActions.deletePropertyFailure({ error: 'PropertyService not provided' }));
        }
        return this.propertyService.deleteProperty(id).pipe(
          map(() =>
            PropertiesActions.deletePropertySuccess({ id })
          ),
          catchError((error: any) =>
            of(PropertiesActions.deletePropertyFailure({ error: error.message }))
          )
        );
      })
    )
  );

  bulkUpdateProperties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.bulkUpdateProperties),
      switchMap(({ propertyIds, updates }): Observable<Action> => {
        if (!this.propertyService) {
          return of(PropertiesActions.bulkUpdatePropertiesFailure({ error: 'PropertyService not provided' }));
        }
        return this.propertyService.bulkUpdateProperties(propertyIds, updates).pipe(
          map(({ updated }: any) =>
            PropertiesActions.bulkUpdatePropertiesSuccess({ updated })
          ),
          catchError((error: any) =>
            of(PropertiesActions.bulkUpdatePropertiesFailure({ error: error.message }))
          )
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    @Optional() @Inject(PROPERTY_SERVICE) private propertyService?: any
  ) {}
}
