import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  forgotPasswordForm: FormGroup;
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  emailSent = signal<boolean>(false);

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const email = this.forgotPasswordForm.value.email;

    this.http.post(`${environment.apiUrl}/auth/forgot-password`, { email }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.emailSent.set(true);
        this.successMessage.set(
          'Password reset instructions have been sent to your email address. Please check your inbox.'
        );
        this.forgotPasswordForm.reset();
      },
      error: (error) => {
        this.isLoading.set(false);
        
        if (error.status === 404) {
          this.errorMessage.set('No account found with this email address.');
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
