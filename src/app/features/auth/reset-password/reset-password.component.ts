import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { InputComponent, ButtonComponent, AlertComponent } from '../../../shared/ui';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputComponent, ButtonComponent, AlertComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  resetPasswordForm: FormGroup;
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);
  resetToken = signal<string>('');

  constructor() {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Get reset token from query parameters
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.resetToken.set(token);
      } else {
        this.errorMessage.set('Invalid or missing reset token. Please request a new password reset.');
      }
    });
  }

  get password() {
    return this.resetPasswordForm.get('password');
  }

  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }

  /**
   * Custom validator for password strength
   */
  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    return !passwordValid ? { passwordStrength: true } : null;
  }

  /**
   * Custom validator to check if passwords match
   */
  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    if (!this.resetToken()) {
      this.errorMessage.set('Invalid reset token. Please request a new password reset.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload = {
      token: this.resetToken(),
      password: this.resetPasswordForm.value.password
    };

    this.http.post(`${environment.apiUrl}/auth/reset-password`, payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Your password has been reset successfully. Redirecting to login...');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading.set(false);
        
        if (error.status === 400) {
          this.errorMessage.set('Invalid or expired reset token. Please request a new password reset.');
        } else if (error.status === 429) {
          this.errorMessage.set('Too many requests. Please try again later.');
        } else if (error.status === 0) {
          this.errorMessage.set('Unable to connect to server. Please check your internet connection.');
        } else {
          this.errorMessage.set('An error occurred. Please try again.');
        }
      }
    });
  }
}
