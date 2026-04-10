import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ],
  template: `
    <div class="w-full">
      <label *ngIf="label" [for]="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </label>
      <div class="relative">
        <input
          [id]="id"
          type="date"
          [value]="value"
          (change)="onChange($event)"
          [disabled]="disabled"
          [min]="min"
          [max]="max"
          [class.border-red-500]="error"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          [attr.aria-label]="label || 'Date picker'"
          [attr.aria-invalid]="error ? 'true' : 'false'"
          [attr.aria-describedby]="error ? id + '-error' : null"
        />
      </div>
      <p *ngIf="error" [id]="id + '-error'" class="mt-1 text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </p>
      <p *ngIf="hint && !error" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ hint }}
      </p>
    </div>
  `,
  styles: [`
    :host ::ng-deep input[type="date"] {
      color-scheme: light dark;
    }

    :host ::ng-deep input[type="date"]::-webkit-calendar-picker-indicator {
      cursor: pointer;
      border-radius: 4px;
      margin-right: 2px;
      opacity: 0.6;
      filter: invert(0.8);
    }

    :host ::ng-deep input[type="date"]::-webkit-calendar-picker-indicator:hover {
      opacity: 1;
    }

    /* Dark mode calendar styling */
    @media (prefers-color-scheme: dark) {
      :host ::ng-deep input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
      }
    }
  `]
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() id: string = 'date-picker-' + Math.random().toString(36).substring(2, 11);
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() error: string = '';
  @Input() hint: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() min: string = '';
  @Input() max: string = '';
  @Output() valueChange = new EventEmitter<string>();

  value: string = '';
  private onChangeFn: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChangeFn(this.value);
    this.valueChange.emit(this.value);
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
