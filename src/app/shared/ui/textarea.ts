import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  template: `
    <div class="w-full">
      <label *ngIf="label" [for]="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </label>
      <textarea
        [id]="id"
        [placeholder]="placeholder"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onBlur()"
        [disabled]="disabled"
        [rows]="rows"
        [class.border-red-500]="error"
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed resize-none transition-colors"
        [attr.aria-label]="label || placeholder"
        [attr.aria-invalid]="error ? 'true' : 'false'"
        [attr.aria-describedby]="error ? id + '-error' : null"
      ></textarea>
      <div class="flex justify-between items-end mt-1">
        <div>
          <p *ngIf="error" [id]="id + '-error'" class="text-sm text-red-600 dark:text-red-400">
            {{ error }}
          </p>
          <p *ngIf="hint && !error" class="text-sm text-gray-500 dark:text-gray-400">
            {{ hint }}
          </p>
        </div>
        <p *ngIf="maxLength" class="text-xs text-gray-500 dark:text-gray-400">
          {{ value.length }}/{{ maxLength }}
        </p>
      </div>
    </div>
  `,
  styles: []
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() id: string = 'textarea-' + Math.random().toString(36).substr(2, 9);
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() error: string = '';
  @Input() hint: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() rows: number = 4;
  @Input() maxLength: number = 0;
  @Output() valueChange = new EventEmitter<string>();

  value: string = '';
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
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
