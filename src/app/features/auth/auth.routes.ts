import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Sign In' }
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: { title: 'Forgot Password' }
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    data: { title: 'Reset Password' }
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
