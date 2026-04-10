import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const authReducer = createReducer(
  initialAuthState,
  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  })),
  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Refresh Token
  on(AuthActions.refreshToken, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(AuthActions.refreshTokenSuccess, (state, { token }) => ({
    ...state,
    token,
    isLoading: false,
    error: null
  })),
  on(AuthActions.refreshTokenFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Load Current User
  on(AuthActions.loadCurrentUser, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(AuthActions.loadCurrentUserSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    isLoading: false,
    error: null
  })),
  on(AuthActions.loadCurrentUserFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Update User
  on(AuthActions.updateUser, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(AuthActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoading: false,
    error: null
  })),
  on(AuthActions.updateUserFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
);
