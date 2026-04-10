import { Injectable, Inject, Optional } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import * as NotificationsActions from './notifications.actions';

// Placeholder service token - will be implemented in task 4.1
export const NOTIFICATION_SERVICE = 'NotificationService';

@Injectable()
export class NotificationsEffects {
  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.loadNotifications),
      switchMap(({ page = 1, limit = 20, read }): Observable<Action> => {
        if (!this.notificationService) {
          return of(NotificationsActions.loadNotificationsFailure({ error: 'NotificationService not provided' }));
        }
        return this.notificationService.getNotifications(page, limit, read).pipe(
          map(({ data, total, unreadCount }: any) =>
            NotificationsActions.loadNotificationsSuccess({
              notifications: data,
              total,
              unreadCount
            })
          ),
          catchError((error: any) =>
            of(NotificationsActions.loadNotificationsFailure({ error: error.message }))
          )
        );
      })
    ),
    { dispatch: true }
  );

  markAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.markAsRead),
      switchMap(({ id }): Observable<Action> => {
        if (!this.notificationService) {
          return of(NotificationsActions.markAsReadFailure({ error: 'NotificationService not provided' }));
        }
        return this.notificationService.markAsRead(id).pipe(
          map(() =>
            NotificationsActions.markAsReadSuccess({ id })
          ),
          catchError((error: any) =>
            of(NotificationsActions.markAsReadFailure({ error: error.message }))
          )
        );
      })
    ),
    { dispatch: true }
  );

  markAllAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.markAllAsRead),
      switchMap((): Observable<Action> => {
        if (!this.notificationService) {
          return of(NotificationsActions.markAllAsReadFailure({ error: 'NotificationService not provided' }));
        }
        return this.notificationService.markAllAsRead().pipe(
          map(({ updated }: any) =>
            NotificationsActions.markAllAsReadSuccess({ updated })
          ),
          catchError((error: any) =>
            of(NotificationsActions.markAllAsReadFailure({ error: error.message }))
          )
        );
      })
    ),
    { dispatch: true }
  );

  deleteNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.deleteNotification),
      switchMap(({ id }): Observable<Action> => {
        if (!this.notificationService) {
          return of(NotificationsActions.deleteNotificationFailure({ error: 'NotificationService not provided' }));
        }
        return this.notificationService.deleteNotification(id).pipe(
          map(() =>
            NotificationsActions.deleteNotificationSuccess({ id })
          ),
          catchError((error: any) =>
            of(NotificationsActions.deleteNotificationFailure({ error: error.message }))
          )
        );
      })
    ),
    { dispatch: true }
  );

  clearAllNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.clearAllNotifications),
      switchMap((): Observable<Action> => {
        if (!this.notificationService) {
          return of(NotificationsActions.clearAllNotificationsFailure({ error: 'NotificationService not provided' }));
        }
        return this.notificationService.clearAllNotifications().pipe(
          map(() =>
            NotificationsActions.clearAllNotificationsSuccess()
          ),
          catchError((error: any) =>
            of(NotificationsActions.clearAllNotificationsFailure({ error: error.message }))
          )
        );
      })
    ),
    { dispatch: true }
  );

  constructor(
    private actions$: Actions,
    @Optional() @Inject(NOTIFICATION_SERVICE) private notificationService?: any
  ) {}
}
