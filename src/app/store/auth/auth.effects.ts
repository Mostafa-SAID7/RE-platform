import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }): Observable<Action> =>
        this.authService.login({ email, password }).pipe(
          map((user) =>
            AuthActions.loginSuccess({ user, token: '' })
          ),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message }))
          )
        )
      )
    ),
    { dispatch: true }
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token }) => {
          localStorage.setItem('token', token);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap((): Observable<Action> =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError((error) =>
            of(AuthActions.logoutFailure({ error: error.message }))
          )
        )
      )
    ),
    { dispatch: true }
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
      ),
    { dispatch: false }
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      switchMap((): Observable<Action> =>
        this.authService.refreshToken().pipe(
          map((token) =>
            AuthActions.refreshTokenSuccess({ token })
          ),
          catchError((error) =>
            of(AuthActions.refreshTokenFailure({ error: error.message }))
          )
        )
      )
    ),
    { dispatch: true }
  );

  refreshTokenSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.refreshTokenSuccess),
        tap(({ token }) => {
          localStorage.setItem('token', token);
        })
      ),
    { dispatch: false }
  );

  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadCurrentUser),
      switchMap((): Observable<Action> => {
        const user = this.authService.getCurrentUser();
        if (user) {
          return of(AuthActions.loadCurrentUserSuccess({ user }));
        }
        return of(AuthActions.loadCurrentUserFailure({ error: 'No user found' }));
      })
    ),
    { dispatch: true }
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateUser),
      switchMap(({ user }): Observable<Action> => {
        // Since AuthService doesn't have updateUser, we'll just update locally
        // Create a full User object from the partial update
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          const updatedUser: User = { ...currentUser, ...user };
          return of(AuthActions.updateUserSuccess({ user: updatedUser }));
        }
        return of(AuthActions.updateUserFailure({ error: 'No current user' }));
      })
    ),
    { dispatch: true }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
}
