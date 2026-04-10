import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="w-full">
      <label *ngIf="label" [for]="inputId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </label>
      <div class="relative">
        <input
          [id]="inputId"
          [type]="isPasswordVisible() ? 'text' : type"
          [placeholder]="placeholder"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onBlur()"
          [disabled]="disabled"
          [class.border-red-500]="error"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          [class.pr-10]="type === 'password'"
          [attr.aria-label]="label || placeholder"
          [attr.aria-invalid]="error ? 'true' : 'false'"
          [attr.aria-describedby]="error ? inputId + '-error' : null"
        />
        <!-- Password Toggle Eye Icon -->
        <button
          *ngIf="type === 'password'"
          type="button"
          (click)="togglePasswordVisibility()"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded"
          [attr.aria-label]="isPasswordVisible() ? 'Hide password' : 'Show password'"
        >
          @if (isPasswordVisible()) {
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
            </svg>
          } @else {
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
            </svg>
          }
        </button>
      </div>
      <p *ngIf="error" [id]="inputId + '-error'" class="mt-1 text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </p>
      <p *ngIf="hint && !error" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ hint }}
      </p>
    </div>
  `,
  styles: []
})
export class InputComponent implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() error: string = '';
  @Input() hint: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Output() valueChange = new EventEmitter<string>();

  value: string = '';
  isPasswordVisible = signal<boolean>(false);
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get inputId(): string {
    return this.id || 'input-' + Math.random().toString(36).substring(2, 11);
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
