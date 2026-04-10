import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

// Login
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: string }>()
);

// Token Refresh
export const refreshToken = createAction('[Auth] Refresh Token');

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ token: string }>()
);

export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>()
);

// Load Current User
export const loadCurrentUser = createAction('[Auth] Load Current User');

export const loadCurrentUserSuccess = createAction(
  '[Auth] Load Current User Success',
  props<{ user: User }>()
);

export const loadCurrentUserFailure = createAction(
  '[Auth] Load Current User Failure',
  props<{ error: string }>()
);

// Update User
export const updateUser = createAction(
  '[Auth] Update User',
  props<{ user: Partial<User> }>()
);

export const updateUserSuccess = createAction(
  '[Auth] Update User Success',
  props<{ user: User }>()
);

export const updateUserFailure = createAction(
  '[Auth] Update User Failure',
  props<{ error: string }>()
);
