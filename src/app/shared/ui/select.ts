import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="w-full">
      <label *ngIf="label" [for]="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </label>
      <select
        [id]="id"
        [value]="value"
        (change)="onChange($event)"
        (blur)="onBlur()"
        [disabled]="disabled"
        [class.border-red-500]="error"
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors appearance-none cursor-pointer"
        [attr.aria-label]="label"
        [attr.aria-invalid]="error ? 'true' : 'false'"
        [attr.aria-describedby]="error ? id + '-error' : null"
      >
        <option *ngIf="placeholder" value="">{{ placeholder }}</option>
        <option *ngFor="let option of options" [value]="option.value" [disabled]="option.disabled">
          {{ option.label }}
        </option>
      </select>
      <p *ngIf="error" [id]="id + '-error'" class="mt-1 text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </p>
      <p *ngIf="hint && !error" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ hint }}
      </p>
    </div>
  `,
  styles: []
})
export class SelectComponent implements ControlValueAccessor {
  @Input() id: string = 'select-' + Math.random().toString(36).substr(2, 9);
  @Input() label: string = '';
  @Input() placeholder: string = 'Select an option';
  @Input() options: SelectOption[] = [];
  @Input() error: string = '';
  @Input() hint: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Output() valueChange = new EventEmitter<string | number>();

  value: string | number = '';
  private onChangeFn: (value: string | number) => void = () => {};
  private onTouched: () => void = () => {};

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChangeFn(this.value);
    this.valueChange.emit(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: string | number): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
