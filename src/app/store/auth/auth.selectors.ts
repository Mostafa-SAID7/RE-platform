import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);

export const selectError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectUserRole = createSelector(
  selectUser,
  (user) => user?.role || null
);

export const selectUserPermissions = createSelector(
  selectUser,
  (user) => user?.permissions || []
);

export const selectHasPermission = (resource: string, action: string) =>
  createSelector(
    selectUserPermissions,
    (permissions) =>
      permissions.some(
        (p) => p.resource === resource && p.actions.includes(action as any)
      )
  );

export const selectHasRole = (role: string) =>
  createSelector(
    selectUserRole,
    (userRole) => userRole === role
  );

export const selectHasAnyRole = (roles: string[]) =>
  createSelector(
    selectUserRole,
    (userRole) => roles.includes(userRole || '')
  );
